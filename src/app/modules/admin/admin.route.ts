import express from 'express';
import { ROLE } from '../../constant/constant';
// import authMiddleware from '../../middlewares/authMiddleware';
import { addFoodToRestaurant, createRestaurant, foodDelete, listAllRestaurants, listFoodsInRestaurant } from '../restaurant/restaurant.controller';

const router = express.Router();
router.post("/restaurants/create", createRestaurant);
router.post("/restaurants/:restaurantId/foods/create", addFoodToRestaurant);
router.get("/restaurants/list", listAllRestaurants);
router.get("/restaurant/:restaurantId/foods", listFoodsInRestaurant);

router.delete("/foods/delete/:id" ,foodDelete )

export const AdminRoute = router;
