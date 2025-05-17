import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';
import config from '../config';
import { TUserRole } from '../interface/userInterface';
import { UserModel } from '../models/User';
import { ROLE } from '../constant/constant';

const userAuth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'Token is missing or UnAuthorized Access!!',
      );
    }

    // checking if the token is missing
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    // checking if the given token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_secret_token as string,
    ) as JwtPayload;

    if (!decoded) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    const { role, userId } = decoded;

    // checking if the user is exist
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'You are not authorized!');
    }
    // checking if the user is already isBlocked

    const isBlocked = user?.isBlocked;

    if (isBlocked) {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is Blocked !');
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You are  unAuthorized  Person!',
      );
    }

    req.user = decoded as JwtPayload;
    next();
  });
};


// Aliaes for different roles
const adminAuth = userAuth(ROLE.admin);
const employeeAuth = userAuth(ROLE.employee);
const userOnlyAuth = userAuth(ROLE.user);

// Auth Middleware for all authenticated users (admin, celebrity, user)
const anyAuth = userAuth(ROLE.admin, ROLE.employee, ROLE.user);

export { userAuth, adminAuth, employeeAuth, userOnlyAuth, anyAuth };

// export default userAuth;
