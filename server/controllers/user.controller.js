import User from "../models/User.model.js";

export const getProfile = async (req, res) => {
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

export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", role = "" } = req.query;
    const skip = (page - 1) * limit;
    const currentUser = req.user;

    // Build filter query
    let filter = {};

    // Search by name or email
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by role
    if (role) {
      filter.role = role;
    }

    // Hide SUPER_ADMIN from non-SUPER_ADMIN admins
    if (currentUser.role !== "super_admin") {
      filter.role = { $ne: "super_admin" };
    }

    // Get total count
    const total = await User.countDocuments(filter);

    // Get users with pagination
    const users = await User.find(filter)
      .select("-password -refreshToken")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    res.status(200).json({
      success: true,
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -refreshToken",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Hide SUPER_ADMIN details from non-SUPER_ADMIN admins
    if (req.user.role !== "super_admin" && user.role === "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Cannot view SUPER_ADMIN details",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked",
      });
    }

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

export const updateRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;
    const currentUser = req.user;

    // Validate role
    const validRoles = ["user", "admin", "super_admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    // Only SUPER_ADMIN can set admin role
    if (role === "admin" && currentUser.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Only SUPER_ADMIN can create ADMIN accounts",
      });
    }

    // Cannot modify SUPER_ADMIN
    const targetUser = await User.findById(userId);
    if (targetUser.role === "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Cannot modify SUPER_ADMIN account",
      });
    }

    // Cannot promote someone to SUPER_ADMIN
    if (role === "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Cannot promote users to SUPER_ADMIN",
      });
    }

    // Cannot modify yourself
    if (userId === currentUser._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Cannot modify your own role",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true },
    ).select("-password -refreshToken");

    console.log(`Admin ${currentUser._id} changed ${userId} role to ${role}`);

    res.status(200).json({
      success: true,
      message: "Role updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, phone } = req.body;
    const currentUser = req.user;

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Cannot modify SUPER_ADMIN
    if (targetUser.role === "super_admin") {
      return res
        .status(403)
        .json({ success: false, message: "Cannot modify SUPER_ADMIN account" });
    }

    // Prevent duplicate email
    if (email && email.toLowerCase() !== targetUser.email) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res
          .status(409)
          .json({ success: false, message: "Email already in use" });
      }
    }

    // Update allowed fields
    targetUser.name = name || targetUser.name;
    targetUser.email = email ? email.toLowerCase() : targetUser.email;
    targetUser.phone = phone || targetUser.phone;

    await targetUser.save();

    const userSafe = await User.findById(userId).select(
      "-password -refreshToken",
    );

    res.status(200).json({ success: true, user: userSafe });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const currentUser = req.user;

    // Cannot delete SUPER_ADMIN
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (targetUser.role === "super_admin") {
      return res
        .status(403)
        .json({ success: false, message: "Cannot delete SUPER_ADMIN account" });
    }

    // Cannot delete yourself
    if (userId === currentUser._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Cannot delete your own account" });
    }

    await User.findByIdAndDelete(userId);

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const blockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const currentUser = req.user;

    // Cannot block SUPER_ADMIN
    const targetUser = await User.findById(userId);
    if (targetUser.role === "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Cannot block SUPER_ADMIN account",
      });
    }

    // Cannot block yourself
    if (userId === currentUser._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Cannot block your own account",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isBlocked: true },
      { new: true },
    ).select("-password -refreshToken");

    console.log(`Admin ${currentUser._id} blocked user ${userId}`);

    res.status(200).json({
      success: true,
      message: "User blocked successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const currentUser = req.user;

    // Cannot unblock SUPER_ADMIN
    const targetUser = await User.findById(userId);
    if (targetUser.role === "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Cannot unblock SUPER_ADMIN account",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isBlocked: false },
      { new: true },
    ).select("-password -refreshToken");

    console.log(`Admin ${currentUser._id} unblocked user ${userId}`);

    res.status(200).json({
      success: true,
      message: "User unblocked successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
