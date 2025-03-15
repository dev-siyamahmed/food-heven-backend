
import stripe from "stripe";
import OrderModel from "./order.model";
import catchAsync from "../../utils/catchAsync";
import CartModel from "../cart/cartModel";

const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY as string); // Replace with your Stripe secret key


export const createOrder = catchAsync(async (req, res) => {
    try {
        const { email, items, totalPrice } = req.body;

        const paymentIntent = await stripeClient.paymentIntents.create({
            amount: totalPrice * 100,
            currency: "usd",
            payment_method_types: ["card"],
        });

        const newOrder = new OrderModel({
            email,
            items,
            totalPrice,
            paymentStatus: "pending",
            paymentIntentId: paymentIntent.id,
        });

        await newOrder.save();

        res.status(201).json({ success: true, clientSecret: paymentIntent.client_secret, orderId: newOrder._id });
    } catch (error) {
        res.status(500).json({ success: false, message: "Order creation failed" });
    }
})


export const updateOrderPayment = catchAsync(async (req, res) => {
    try {
        const { orderId, email } = req.body;

        // Find the order
        const order = await OrderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Update payment status
        order.paymentStatus = "paid";
        await order.save();

        // ✅ Clear the cart by finding it using `user` reference
        const deletedCart = await CartModel.findOneAndDelete({ "items.email": email });

        if (!deletedCart) {
            return res.status(404).json({ success: false, message: "Cart not found or already empty." });
        }

        res.status(200).json({
            success: true,
            message: "Payment successful! Cart deleted.",
        });

    } catch (error) {
        console.error("Payment update failed:", error);
        res.status(500).json({ success: false, message: "Payment update failed" });
    }
});


export const getAllOrdersForAdmin = catchAsync(async (req, res) => {
    const orders = await OrderModel.find({ paymentStatus: "paid" }).populate("items.foodId") // 👈 This populates foodId with full food details
        .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
});



export const orderStatusUpdate = catchAsync(async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    console.log("status" , status);
    
    const order = await OrderModel.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Order status updated", order });
});

// ✅ Get all orders for a specific user
export const getOrdersForUser = catchAsync(async (req, res) => {
    const { email } = req.params;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }

    try {
        const orders = await OrderModel.find({ email, paymentStatus: "paid" })
            .populate("items.foodId") // 👈 This populates foodId with full food details
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Fetching user orders failed:", error);
        res.status(500).json({ success: false, message: "Failed to fetch user orders" });
    }
});
