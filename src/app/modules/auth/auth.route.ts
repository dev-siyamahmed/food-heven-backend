import express from 'express';
import { AuthController, profileInfo } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';

const router = express.Router();

router.post(
  '/register',
  validateRequest(AuthValidation.createUserValidationSchema),
  AuthController.registerUser,
);
router.post(
  '/verify-otp',
  AuthController.verifyOtpAndRegisterUser,
);

router.post(
  '/login',
  validateRequest(AuthValidation.loginUserValidationSchema),
  AuthController.loginUser,
);




export const AuthRoute = router;
