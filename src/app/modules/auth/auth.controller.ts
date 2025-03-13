import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserModel } from '../user/user.model';
import { AuthService } from './auth.service';
import httpStatus from 'http-status';

const registerUser = catchAsync(async (req, res) => {
  const result = await AuthService.registerUserInitiate(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data : null
  });
});

const verifyOtpAndRegisterUser = catchAsync(async (req, res) => {
  
  const result = await AuthService.verifyOtpAndRegisterUser(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthService.loginUserFromDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Login successful',
    data: result,
  });
});



export const profileInfo = catchAsync(async (req, res) => {
  const { email } = req.params; 
  // Find the user by userId
  const user = await UserModel.findOne({email}) 

  if (!user) {
      return sendResponse(res, {
          statusCode: httpStatus.NOT_FOUND,
          success: false,
          message: "User not found",
          data: null
      });
  }

  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User profile retrieved successfully",
      data: user,  // Send the user data
  });
});

export const AuthController = {
  registerUser,
  verifyOtpAndRegisterUser,
  loginUser,
};
