import mongoose, { Schema, Document } from "mongoose";

// Cart item interface
export interface ICartItem {
  foodId: Schema.Types.ObjectId;  // Reference to food in the Restaurant schema
  quantity: number;
  email: string            // Quantity of the food in the cart
}

// Cart interface
export interface ICart extends Document {
  user: Schema.Types.ObjectId;  // Reference to the user
  items: ICartItem[];           // List of items in the cart
  totalPrice: number;           // Total price of the cart items
}

const CartItemSchema = new Schema<ICartItem>({
  foodId: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true }, // Referencing the Restaurant model
  quantity: { type: Number, required: true, min: 1 },
  email: { type: String, },
});

const CartSchema = new Schema<ICart>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: [CartItemSchema],
  totalPrice: { type: Number, default: 0 },
}, { timestamps: true });

const CartModel = mongoose.model<ICart>("Cart", CartSchema);

export default CartModel;
