import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import RestaurantModel from "../restaurant/restaurant.model";
import CartModel from "./cartModel";
import FoodModel from "../food/foodModel";

export const addFoodToCart = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;  // Assuming userId is available from JWT or session
  const { foodId, quantity, email } = req.body;  // Food ID and quantity to be added to the cart

  // Validate quantity
  if (quantity <= 0) {
    return res.status(400).json({ message: "Quantity must be greater than 0" });
  }

  // Find the food item by its ID in the Food model
  const food = await FoodModel.findById(foodId);
  if (!food) {
    return res.status(404).json({ message: "Food not found" });
  }

  // Check if the quantity requested is available in stock
  if (quantity > food.stock) {
    return res.status(400).json({ message: `Only ${food.stock} items available in stock` });
  }

  // Check if cart exists for the user
  let cart = await CartModel.findOne({ user: userId });

  if (!cart) {
    // If no cart exists for the user, create a new one
    cart = new CartModel({ user: userId, items: [] });
  }

  // Check if the food item already exists in the cart
  const existingItemIndex = cart.items.findIndex(item => item.foodId.toString() === foodId);

  if (existingItemIndex !== -1) {
    // If food item exists, update the quantity
    const currentQuantity = cart.items[existingItemIndex].quantity;
    const newQuantity = currentQuantity + quantity;

    // Check if the updated quantity is available in stock
    if (newQuantity > food.stock) {
      return res.status(400).json({ message: `Only ${food.stock} items available in stock` });
    }

    // Update the quantity in the cart
    cart.items[existingItemIndex].quantity = newQuantity;
  } else {
    // If food item doesn't exist, add a new item to the cart
    cart.items.push({ foodId, quantity, email });
  }

  // Calculate the total price for the added items
  const totalPrice = food.price * quantity;

  // Add total price to the cart (optional: you can store a running total for the entire cart)
  cart.totalPrice = cart.totalPrice ? cart.totalPrice + totalPrice : totalPrice;

  // Save or update the cart
  await cart.save();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Food added to cart successfully",
    data: cart,
  });
});





// export const addFoodToCart = catchAsync(async (req, res) => {


//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Food added to cart successfully",
//     data: cart,
//   });
// });







export const getCart = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;  // Get the userId from JWT or session

  console.log(userId);

  // Find the user's cart and populate the `foodId` field
  const cart = await CartModel.findOne({ user: userId })
    .populate({
      path: 'items.foodId', // Path to populate foodId inside items array
      model: 'Food',        // Reference to Food model for populating
      select: 'name price description category stock imageUrl rating discount', // Select fields to populate
    });

  console.log("cart", cart);

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cart retrieved successfully",
    data: cart,  // Send the populated cart with food details
  });
});



export const removeFoodFromCart = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;  // Get the userId from JWT or session
  const { foodId } = req.params;  // Food ID to be removed from the cart

  // Find the user's cart
  const cart = await CartModel.findOne({ user: userId });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  // Check if the food item exists in the cart
  const foodIndex = cart.items.findIndex(item => item.foodId.toString() === foodId);

  if (foodIndex === -1) {
    return res.status(404).json({ message: "Food not found in cart" });
  }

  // Remove the food item from the cart
  cart.items.splice(foodIndex, 1);

  // Save the updated cart
  await cart.save();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Food removed from cart successfully",
    data: cart,
  });
});