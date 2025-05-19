import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { TUser, TUserModel } from '../interface/userInterface';
import config from '../config';

const UserSchema: Schema = new Schema<TUser>(
  {
    name: { type: String, required: true , minlength: 3, maxlength: 30},
    email: { type: String, required: true },
    password: { type: String, required: true, select: 0 },
    role: { type: String, enum: ['admin', 'user', 'employee'], default: 'user' },
    verified: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'inactive', 'delete', 'block'], default: 'active' },
  },
  {
    timestamps: true,
  },
);

UserSchema.pre('save', async function (next) {
  const user = this;

  // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  try {
    // hashing password
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_round),
    );
    next();
  } catch (error: any) {
    next(error);
  }
});

// set '' after saving password
UserSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

UserSchema.statics.isUserExistsByCustomId = async function (email: string) {
  return UserModel.findOne({ email }).select('+password');
};

UserSchema.statics.isPasswordValidation = async function (
  plainTextPassword: string,
  hashPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashPassword);
};

export const UserModel = model<TUser, TUserModel>('User', UserSchema);
