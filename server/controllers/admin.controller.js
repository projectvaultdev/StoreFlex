import User from "../models/User.model.js";
import Product from "../models/Product.model.js";
import Order from "../models/Order.model.js";
import Category from "../models/Category.model.js";
import { ROLES } from "../constants/roles.js";

// Create staff/admin/manager accounts by authorized admins
export const createStaffAccount = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const currentUser = req.user;

    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    // Only SUPER_ADMIN can create ADMIN accounts
    if (role === ROLES.ADMIN && currentUser.role !== ROLES.SUPER_ADMIN) {
      return res.status(403).json({
        success: false,
        message: "Only SUPER_ADMIN can create ADMIN accounts",
      });
    }

    // SUPER_ADMIN can create ADMIN/MANAGER/STAFF
    // ADMIN can create MANAGER/STAFF only
    const allowedByAdmin = [ROLES.MANAGER, ROLES.STAFF];
    const allowedBySuper = [ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF];

    if (
      currentUser.role === ROLES.SUPER_ADMIN &&
      !allowedBySuper.includes(role)
    ) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    if (currentUser.role === ROLES.ADMIN && !allowedByAdmin.includes(role)) {
      return res.status(403).json({
        success: false,
        message: "ADMIN can only create MANAGER or STAFF",
      });
    }

    // Prevent creating SUPER_ADMIN
    if (role === ROLES.SUPER_ADMIN) {
      return res
        .status(403)
        .json({ success: false, message: "Cannot create SUPER_ADMIN" });
    }

    // Prevent duplicate email
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Email already in use" });
    }

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role,
      createdBy: currentUser._id,
      isVerified: true,
    });

    const userSafe = await User.findById(newUser._id).select(
      "-password -refreshToken",
    );

    res.status(201).json({ success: true, user: userSafe });
  } catch (error) {
    console.error("createStaffAccount Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDashboard = async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Get total revenue from PAID orders
    const revenueData = await Order.aggregate([
      {
        $match: {
          paymentStatus: "PAID",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    // Get low stock products (stock <= 5)
    const lowStockProducts = await Product.find({
      $expr: {
        $lte: ["$stock", 5],
      },
      isDeleted: false,
    })
      .select("_id name stock price lowStockThreshold")
      .sort({ stock: 1 })
      .limit(10)
      .lean();

    // Get recent orders (latest 5)
    const recentOrders = await Order.find()
      .populate("user", "_id name email phone")
      .select("_id totalAmount orderStatus paymentStatus createdAt")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalCategories,
        totalOrders,
        totalUsers,
        totalRevenue,
        lowStockProducts,
        recentOrders,
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch dashboard data",
    });
  }
};
