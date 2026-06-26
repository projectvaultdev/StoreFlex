import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import crypto from "crypto";
import sendEmail from "../services/email.service.js";
import generateResetToken from "../utils/generateResetToken.js";
import generateOTP from "../utils/generateOTP.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      message: "Registration Successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const accessToken = generateAccessToken(user._id, user.role);

    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;

    await user.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,

      message: "Login Successful",

      accessToken,

      user: {
        _id: user._id,

        name: user.name,

        email: user.email,

        avatar: user.avatar,

        phone: user.phone,

        role: user.role,

        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.refreshToken = "";

      await user.save();
    }

    res.clearCookie("accessToken");

    res.clearCookie("refreshToken");

    return res.status(200).json({
      success: true,

      message: "Logout Successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token missing",
      });
    }

    // Verify token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user
    const user = await User.findById(decoded.userId);
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked",
      });
    }

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Generate new access token
    const accessToken = generateAccessToken(user._id, user.role);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,

      accessToken,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Token expired",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { resetToken, hashedToken } = generateResetToken();

    user.resetPasswordToken = hashedToken;

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    //     const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    //     const message = `
    // Reset your password using this link:

    // ${resetUrl}

    // This link will expire in 15 minutes.
    // `;

    //     await sendEmail(user.email, "Password Reset", message);

    // res.status(200).json({
    //   success: true,
    //   message: "Password reset email sent",
    // });

    res.status(200).json({
      success: true,
      message: "Reset token generated",
      resetToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,

      resetPasswordExpire: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    user.password = req.body.password;

    user.resetPasswordToken = undefined;

    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked",
      });
    }

    const isPasswordMatched = await user.comparePassword(currentPassword);

    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const sendOTP = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked",
      });
    }

    const otp = generateOTP();

    user.otp = otp;

    user.otpExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP generated",
      otp,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;

    const user = await User.findById(req.user._id);
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked",
      });
    }

    if (user.otp !== otp || user.otpExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    user.isVerified = true;

    user.otp = undefined;

    user.otpExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -refreshToken",
    );

    res.status(200).json({
      success: true,

      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,

        message: "User not found",
      });
    }

    user.name = req.body.name || user.name;

    user.phone = req.body.phone || user.phone;

    user.avatar = req.body.avatar || user.avatar;

    await user.save();

    res.status(200).json({
      success: true,

      message: "Profile Updated",

      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
