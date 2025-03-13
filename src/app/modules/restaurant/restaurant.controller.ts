import { Request, Response } from "express";
import RestaurantModel from "./restaurant.model";
import sendResponse from "../../utils/sendResponse";
import FoodModel from "../food/foodModel";
import catchAsync from "../../utils/catchAsync";

// Create a Restaurant
export const createRestaurant = catchAsync(async (req, res) => {
  const { restaurantName, location, image } = req.body;

  // Create a new restaurant
  const newRestaurant = await RestaurantModel.create({
    restaurantName,
    location,
    image,
    foods: [],  // Foods array is initially empty
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Restaurant created successfully",
    data: newRestaurant,
  });
});


// Add Food to Restaurant
export const addFoodToRestaurant = catchAsync(async (req, res) => {
  const { restaurantId } = req.params; // Get restaurantId from the URL
  const { foods } = req.body; // Array of food objects to be added

  // Find the restaurant by its ID
  const restaurant = await RestaurantModel.findById(restaurantId);

  if (!restaurant) {
    return res.status(404).json({ message: "Restaurant not found" });
  }

  // Create the food items
  const createdFoods = await FoodModel.create(foods);

  // Ensure createdFoods is always an array
  const foodsArray = Array.isArray(createdFoods) ? createdFoods : [createdFoods];

  // Add the food items to the restaurant's foods array
  restaurant.foods.push(...foodsArray.map(food => food._id));

  // Save the restaurant with the new foods added
  await restaurant.save();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Food items added to restaurant successfully",
    data: foodsArray,
  });
});


export const listFoodsInRestaurant = catchAsync(async (req: Request, res: Response) => {
  const { restaurantId } = req.params;  // Get the restaurantId from the URL
  // Find the restaurant by its ID and populate the food items
  const restaurant = await RestaurantModel.findById(restaurantId).populate({
    path: 'foods',    // Populate the `foods` array (which contains food references)
    select: 'name price description category stock imageUrl rating discount', // You can select which fields to return
  });

  if (!restaurant) {
    return res.status(404).json({ message: "Restaurant not found" });
  }

  // Return the list of foods in the restaurant
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Foods in the restaurant retrieved successfully",
    data: restaurant.foods, // Return only the foods array with populated data
  });
});



export const listAllRestaurants = catchAsync(async (req: Request, res: Response) => {
  // Fetch all restaurants and optionally populate the foods array
  const restaurants = await RestaurantModel.find().populate({
    path: 'foods',  // Populate the `foods` array (which contains food references)
    select: 'name price description category stock imageUrl rating discount',  // Select which fields to return for each food
  });

  if (!restaurants) {
    return res.status(404).json({ message: "No restaurants found" });
  }

  // Return the list of restaurants
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Restaurants retrieved successfully",
    data: restaurants, // Send the list of restaurants, each with populated food details if needed
  });
});



export const foodDelete = catchAsync(async (req, res) => {
  const { id } = req.params;
  // Check if food exists
  const food = await FoodModel.findById(id);
  if (!food) {
    return res.status(404).json({ success: false, message: "Food item not found." });
  }
  // Delete food
  await FoodModel.findByIdAndDelete(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Food item deleted successfully",
    data: null, // Send the list of restaurants, each with populated food details if needed
  });

})