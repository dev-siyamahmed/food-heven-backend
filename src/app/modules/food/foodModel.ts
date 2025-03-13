import mongoose, { Schema, Document } from "mongoose";

export interface IFood extends Document {
  name: string;                  // Name of the food item
  price: number;                 // Price per serving
  description: string;           // Short description
  category: string;              // Category (e.g., Appetizer, Main Course, Dessert)
  isAvailable: boolean;          // Availability status
  imageUrl?: string;             // Optional: Image URL for the food
  rating?: number;               // Optional: Average customer rating (1-5)
  stock: number;                 // Stock quantity available
  discount?: number;             // Optional: Discount percentage  
  createdAt?: Date;              // Optional: Timestamp for when the item was added
  updatedAt?: Date;              // Optional: Timestamp for the last update
}

const FoodSchema = new Schema<IFood>(
  {
    name: { type: String, },
    price: { type: Number, },
    description: { type: String, },
    category: { type: String, },
    imageUrl: { type: String, default: null },
    rating: { type: Number, min: 0, max: 5, default: null },
    stock: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
  },
  {
    timestamps: true,  // Automatically manage createdAt and updatedAt
  }
);

const FoodModel = mongoose.model<IFood>("Food", FoodSchema);
export default FoodModel;
