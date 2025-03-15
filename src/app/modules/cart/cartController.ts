import catchAsync from "../../utils/catchAsync";
import CartModel from "./cartModel";
import FoodModel from "../food/foodModel";


export const addFoodToCart = catchAsync(async (req, res) => {
  const { foodId, quantity, email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "ইমেইল প্রয়োজন!" });
  }

  if (quantity <= 0) {
    return res.status(400).json({ success: false, message: "পরিমাণ অবশ্যই ১ বা তার বেশি হতে হবে!" });
  }

  // ফুড পাওয়া গেল কিনা চেক করা
  const food = await FoodModel.findById(foodId);
  if (!food) {
    return res.status(404).json({ success: false, message: "Food not found!" });
  }

  // কার্ট চেক করা
  let cart = await CartModel.findOne({ "items.email": email });

  if (!cart) {
    // নতুন কার্ট তৈরি করা
    cart = new CartModel({ user: null, items: [], totalPrice: 0 });
  }

  // কার্টে ফুড আইটেম আছে কিনা চেক করা
  const existingItemIndex = cart.items.findIndex((item) => item.foodId.toString() === foodId && item.email === email);

  if (existingItemIndex !== -1) {
    // যদি ফুড আগেই থাকে তাহলে পরিমাণ আপডেট করা
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    // নতুন ফুড আইটেম যুক্ত করা
    cart.items.push({ foodId, quantity, email });
  }

  // টোটাল প্রাইস আপডেট করা
  cart.totalPrice = cart.items.reduce((total, item) => {
    return total + food.price * item.quantity;
  }, 0);

  await cart.save();

  res.status(200).json({
    success: true,
    message: "কার্টে সফলভাবে যোগ হয়েছে!",
    cart,
  });
});


export const getCart = catchAsync(async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ success: false, message: "ইমেইল প্রদান করুন!" });
  }

  const cart = await CartModel.aggregate([
    { $match: { "items.email": email } },
    { $unwind: "$items" },
    {
      $lookup: {
        from: "foods", // Ensure this matches the correct MongoDB collection name
        localField: "items.foodId",
        foreignField: "_id",
        as: "foodDetails",
      }
    },
    { $unwind: "$foodDetails" },
    {
      $project: {
        _id: 1,
        user: 1,
        "items.foodId": "$items.foodId",
        "items.quantity": "$items.quantity",
        "items.email": "$items.email",
        "items.foodDetails": "$foodDetails",
        "items.totalItemPrice": { $multiply: ["$items.quantity", "$foodDetails.price"] }, // Total price per item
        totalPrice: 1,
      }
    },
    {
      $group: {
        _id: "$_id",
        user: { $first: "$user" },
        items: {
          $push: {
            foodId: "$items.foodId",
            quantity: "$items.quantity",
            email: "$items.email",
            foodDetails: "$items.foodDetails",
            totalItemPrice: "$items.totalItemPrice", // Include calculated price per item
          }
        },
        totalPrice: { $sum: "$items.totalItemPrice" } // Calculate total price for the whole cart
      }
    }
  ]);

  if (!cart || cart.length === 0) {
    return res.status(404).json({ success: false, message: "Cart empty!" });
  }

  res.status(200).json({
    success: true,
    message: "cart data fetch successfully",
    cart: cart[0], // Since aggregate returns an array, take the first element
  });
});


export const removeFoodFromCart = catchAsync(async (req, res) => {
  const { foodId, email } = req.params;

  if (!foodId || !email) {
    return res.status(400).json({ success: false, message: "ইমেইল এবং ফুড আইডি প্রদান করুন!" });
  }

  // Find the user's cart
  let cart = await CartModel.findOne({ "items.email": email });

  if (!cart) {
    return res.status(404).json({ success: false, message: "কার্ট খুঁজে পাওয়া যায়নি!" });
  }

  // Find the price of the food before removing
  const foodItem = await FoodModel.findById(foodId);
  const foodPrice = foodItem ? foodItem.price : 0;

  // Remove the specific item
  cart.items = cart.items.filter((item) => item.foodId.toString() !== foodId);

  // Recalculate total price (using actual food price)
  cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * foodPrice, 0);

  await cart.save();

  res.status(200).json({ success: true, message: "আইটেম কার্ট থেকে সফলভাবে সরানো হয়েছে!", cart });
});