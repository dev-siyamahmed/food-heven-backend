import AppError from '../../errors/AppError';
import { TUser } from '../user/user.interface';
import { UserModel } from '../user/user.model';
import httpStatus from 'http-status';
import { TLoginUser } from './auth.interface';
import { createToken } from './auth.utils';
import config from '../../config';
import { OtpService } from '../otp/otp.service';
import { OtpModel } from '../otp/otp.model';
import { TempUserModel } from '../user/tempUser.model';

const registerUserInitiate = async (payload: { email: string; name: string; password: string }) => {
  const isExitsUser = await UserModel.findOne({ email: payload.email });
  if (isExitsUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User Already Exists');
  }
  // Save user data temporarily
  await TempUserModel.create(payload);
  // Generate OTP and send email
  await OtpService.generateOtp(payload.email);
  return { message: 'OTP sent to your email' }};

  

const verifyOtpAndRegisterUser = async (payload: { email: string; otp: number }) => {
  const { email, otp } = payload;
  
  // Find OTP
  const existingOtp = await OtpModel.findOne({ email });

  if (!existingOtp || existingOtp.otp !== otp) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid or expired OTP');
  }

  // Find temporary user data
  const tempUser = await TempUserModel.findOne({ email });
  if (!tempUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'No registration data found');
  }

  // Save user to main User collection
  const newUser = await UserModel.create({
    email: tempUser.email,
    name: tempUser.name,
    password: tempUser.password,
  });

  // Clean up temporary data
  await TempUserModel.deleteOne({ email });
  await OtpModel.deleteOne({ email });

  return newUser;
};



const loginUserFromDB = async (payload: TLoginUser) => {
  // checking if the user is exist
  const user = await UserModel.isUserExistsByCustomId(payload.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already Blocked

  const isBlocked = user?.isBlocked;

  if (isBlocked) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is Blocked !');
  }

  // //checking if the password is correct
  const isValidPassword = await UserModel.isPasswordValidation(
    payload?.password,
    user?.password,
  );
  if (!isValidPassword) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Password is Invalid');
  }

  //create token and sent to the  client
  const jwtPayload = {
    userEmail: user.email,
    role: user.role,
    userId: user._id as string,
  };

  const token = createToken(
    jwtPayload,
    config.jwt_access_secret_key as string,
    config.jwt_access_expires_in as string,
  );

  return {
    token,
  };
};

export const AuthService = {
  registerUserInitiate,
  verifyOtpAndRegisterUser,
  loginUserFromDB,
};
