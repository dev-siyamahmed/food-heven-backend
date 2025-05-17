
import nodemailer from 'nodemailer';
import { OtpModel } from '../models/Otp';
import config from '../config';


class OtpService {
  private otpExpiry = 1 * 60 * 1000; // 1 minute

  private generateOtp(): number {
    // return Math.floor(100000 + Math.random() * 900000); // Returns a number/
    return 123456 // Returns a number
  }

  async createOtp(userId: string, email: string): Promise<number> {
    const otpCode = this.generateOtp();
    await OtpModel.create({ userId, otpCode, expiresAt: new Date(Date.now() + this.otpExpiry) });

    await this.sendOtpEmail(email, otpCode);

    return otpCode;
  }

  // Remove previous OTP for user
  async removeOtpByUserId(userId: string): Promise<void> {
    await OtpModel.deleteMany({ userId });
  }


  private async sendOtpEmail(email: string, otpCode: number): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      // host: process.env.SMTP_HOST,    // SMTP host
      port: parseInt(config.smtp_host || "587"), // SMTP port
      secure: config.smtp_port === "465",       // Secure if using port 465
      auth: {
        user: config.smtp_user, // SMTP username
        pass: config.smtp_pass, // SMTP password
      },
    });

    await transporter.sendMail({
      from: config.email,
      to: email,
      subject: 'আপনার OTP কোড',
      text: `আপনার OTP কোড: ${otpCode}`,
    });
  }

  async verifyOtp(userId: string, otpCode: number): Promise<boolean> {
    console.log(otpCode);

    const otpRecord = await OtpModel.findOne({ userId, otpCode, expiresAt: { $gte: new Date() } });
    if (!otpRecord) return false;

    await OtpModel.deleteOne({ _id: otpRecord._id });
    return true;
  }


}

export default new OtpService();
