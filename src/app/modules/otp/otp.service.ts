import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import { OtpModel } from './otp.model';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendOtpEmail = async (email: string, otp: string) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}. It is valid for 5 minutes.`,
  });
  console.log("0tp" , otp);
};

const generateOtp = async (email: string) => {
    const otp = otpGenerator.generate(6, {
      digits: true,                  // Only digits
      upperCaseAlphabets: false,     // No uppercase letters
      lowerCaseAlphabets: false,     // No lowercase letters
      specialChars: false            // No special characters
    });
  
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration
  
    await OtpModel.create({ email, otp, expiresAt });
    await sendOtpEmail(email, otp);
  };

export const OtpService = {
  generateOtp,
};
