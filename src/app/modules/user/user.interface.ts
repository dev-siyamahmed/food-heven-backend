import { Model } from 'mongoose';
import { ROLE } from '../../constant/constant';

export type TUser = {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export interface TUserModel extends Model<TUser> {
  isUserExistsByCustomId(email: string): Promise<TUser>;

  isPasswordValidation(
    plainTextPassword: string,
    hashPassword: string,
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof ROLE;
