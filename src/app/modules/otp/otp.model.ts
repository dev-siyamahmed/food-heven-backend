import mongoose, { Schema, Document } from 'mongoose';

interface IOtp extends Document {
  email: string;
  otp: number;
  expiresAt: Date;
}

const otpSchema = new Schema<IOtp>({
  email: { type: String, required: true },
  otp: { type: Number, required: true },
  expiresAt: { type: Date, required: true, index: { expires: '5m' } }, // OTP expires in 5 minutes
});

export const OtpModel = mongoose.model<IOtp>('Otp', otpSchema);
