import mongoose, { Schema, Document } from 'mongoose';

interface IOtp {
    userId: Schema.Types.ObjectId;
    otpCode: number;
    expiresAt: Date;
}

const otpSchema = new Schema<IOtp>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    otpCode: { type: Number, required: true },
    expiresAt: { type: Date, required: true, index: { expires: '5m' } }, // OTP expires in 5 minutes
});

export const OtpModel = mongoose.model<IOtp>('Otp', otpSchema);
