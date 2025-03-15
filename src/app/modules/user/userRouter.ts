import express from 'express';
import { addFoodToCart, getCart, removeFoodFromCart } from '../cart/cartController';
import { profileInfo } from '../auth/auth.controller';
import { createOrder, getOrdersForUser, updateOrderPayment } from '../order/orderController';

const router = express.Router();

router.post('/add-to-cart', addFoodToCart);
router.get("/cart/list/:email", getCart);

// Remove a food item from the user's cart
router.delete("/cart/remove/:foodId/:email",removeFoodFromCart);

router.get('/profile/:email',  profileInfo )

// order
router.post('/order/create',  createOrder )
router.post('/order/update-payment',  updateOrderPayment )

router.get('/order/list/:email',  getOrdersForUser )


export const UserRoute = router;