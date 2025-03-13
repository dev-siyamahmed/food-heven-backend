import mongoose, { Schema, Document } from 'mongoose';

interface ITempUser extends Document {
  email: string;
  name: string;
  password: string;
}

const tempUserSchema = new Schema<ITempUser>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true }
});

export const TempUserModel = mongoose.model<ITempUser>('TempUser', tempUserSchema);
