import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from '../errors/AppError';
import { TUserRole } from '../modules/user/user.interface';
import catchAsync from '../utils/catchAsync';
import { UserModel } from '../modules/user/user.model';
import config from '../config';

const authMiddleware = (...requiredRoles: TUserRole[]) => {
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
      config.jwt_access_secret_key as string,
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

export default authMiddleware;
