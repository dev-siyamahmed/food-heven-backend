
import express from 'express';
import { createUser, signInUser, verifyOtpAndCreateUser } from '../../controllers/auth/AuthController';
const router = express.Router()

router.post("/sign-up", createUser)
router.post("/login", signInUser)
router.post("/verify-otp", verifyOtpAndCreateUser)


export const AuthRouter = router