import catchAsync from "../../utils/catchAsync";
import AppError from "../../errors/AppError";
import { UserModel } from "../../models/User";
import { createToken } from "../../utils/genarate.jwt.token";
import otpService from "../../services/otpService";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import config from "../../config";


export const createUser = catchAsync(async (req, res) => {
    const { name, password, email } = req.body;

    if (!email) {
        throw new AppError(httpStatus.BAD_REQUEST, "Email is required");
    }

    if (!password) {
        throw new AppError(httpStatus.BAD_REQUEST, "Password is required");
    }

    // ✅ Check if user exists
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
        throw new AppError(httpStatus.BAD_REQUEST, "Email already exists");
    }

    // ✅ Save user data to User model
    const newUser = await UserModel.create({
        name,
        email,
        password,
        verified: false,
    });

    // ✅ Generate OTP and send it
    const otp = await otpService.createOtp(newUser._id.toString(), email);

    setTimeout(async () => {
        const user = await UserModel.findById(newUser._id);
        if (user && !user.verified) {
            await UserModel.deleteOne({ _id: newUser._id });
            console.log(`User ${newUser._id} deleted due to OTP verification failure.`);
        }
    }, 1 * 60 * 1000);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "OTP sent successfully",
        data: {
            userId: newUser._id,
            otp
        },
    });
});

export const verifyOtpAndCreateUser = catchAsync(async (req, res) => {
    const { otp, userId } = req.body;

    // 🟢 Check if the OTP is valid with userId
    const otpVerified = await otpService.verifyOtp(userId, otp);
    if (!otpVerified) {
        throw new AppError(httpStatus.BAD_REQUEST, 'OTP expired or invalid');
    }

    // 🟢 Check if the user already exists
    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found");
    }

    // 🟢 Update user status to verified (if needed)
    user.verified = true;  // Assuming there is a 'verified' field in User model
    await user.save();

    // New dynamic authentication approach - only include userId in token
    const jwtPayload = {
        userId: user._id as string,
    };

    // Using createToken with only userId (role will be checked from DB)
    const token = createToken(
        jwtPayload,
        config.jwt_secret_token as string,
        config.jwt_token_expires_in as string,
    );



    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User created and verified successfully',
        data: { user, token }
    });
});

export const signInUser = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new AppError(httpStatus.BAD_REQUEST, "Email and password are required");
    }

    const user = await UserModel.findOne({ email }).select('+password');

    if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User not found");
    }

    if (!user.verified) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Please verify your account first");
    }

    if (user.status === "delete" || user.status === "block") {
        throw new AppError(
            httpStatus.UNAUTHORIZED, 
            `Access denied! This account is currently ${user.status === "delete" ? "deleted" : "blocked"}.`
        );
    }

    // Check if password is valid
    const isPasswordValid = await UserModel.isPasswordValidation(password, user.password);
    if (!isPasswordValid) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid password");
    }

    // New dynamic authentication approach - only include userId in token
    const jwtPayload = {
        userId: user._id as string,
    };

    // Using createToken with only userId (role will be checked from DB)
    const token = createToken(
        jwtPayload,
        config.jwt_secret_token as string,
        config.jwt_token_expires_in as string,
    );

    // Create a new object without the password field
    const userWithoutPassword = {
        ...user.toObject(),
        password: undefined
    };

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User signed in successfully',
        data: { user: userWithoutPassword, token },
    });
});
