import mongoose, { Schema, Document } from "mongoose";

interface IRestaurant extends Document {
  restaurantName: string;
  location: string;
  image: string;
  foods: mongoose.Schema.Types.ObjectId[];  // Reference to Food model
}

const RestaurantSchema = new Schema<IRestaurant>({
  restaurantName: { type: String, required: true },
  image: { type: String, required: true },
  location: { type: String, required: true },
  foods: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Food"  // Reference to the Food model
    }
  ],
}, { timestamps: true });

const RestaurantModel = mongoose.model<IRestaurant>("Restaurant", RestaurantSchema);
export default RestaurantModel;
