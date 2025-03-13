import express from 'express';
import { ROLE } from '../../constant/constant';
import { addFoodToCart, getCart, removeFoodFromCart } from '../cart/cartController';
import authMiddleware from '../../middlewares/authMiddleware';
import { profileInfo } from '../auth/auth.controller';

const router = express.Router();

router.post('/add-to-cart', authMiddleware(ROLE.user), addFoodToCart);
router.get("/cart/list", authMiddleware(ROLE.user) , getCart);

// Remove a food item from the user's cart
router.delete("/cart/remove/:foodId",authMiddleware(ROLE.user),removeFoodFromCart);

router.get('/profile/:email',  profileInfo )


export const UserRoute = router;