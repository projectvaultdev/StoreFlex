import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith(
        "Bearer"
      )
    ) {

      token =
        req.headers.authorization.split(
          " "
        )[1];

    }

    if (!token) {

      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });

    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET
    );

    // Find user
    req.user = await User.findById(
      decoded.userId
    ).select("-password -refreshToken");

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });

  }

};