import User from "../models/User.model.js";
import Product from "../models/Product.model.js";
import Order from "../models/Order.model.js";
import Category from "../models/Category.model.js";

export const getDashboardData = async (req, res) => {
  try {
    // Get counts
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Get revenue
    const revenue = await Order.aggregate([
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

    // Get low stock products
    const lowStockProducts = await Product.find({
      $expr: {
        $lte: ["$stock", "$lowStockThreshold"],
      },
      isDeleted: false,
    })
      .select("name stock lowStockThreshold price")
      .limit(5);

    // Get recent orders
    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalCategories,
        totalOrders,
        totalRevenue: revenue[0]?.totalRevenue || 0,
        lowStockProducts,
        recentOrders,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalProducts = await Product.countDocuments();

    const totalOrders = await Order.countDocuments();

    const revenue = await Order.aggregate([
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

    res.status(200).json({
      success: true,

      totalUsers,

      totalProducts,

      totalOrders,

      totalRevenue: revenue[0]?.totalRevenue || 0,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const monthlySales = async (req, res) => {
  try {
    const sales = await Order.aggregate([
      {
        $match: {
          paymentStatus: "PAID",
        },
      },

      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt",
            },
          },

          totalSales: {
            $sum: "$totalAmount",
          },
        },
      },

      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,

      sales,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const topProducts = async (req, res) => {
  try {
    const products = await Order.aggregate([
      {
        $unwind: "$orderItems",
      },

      {
        $group: {
          _id: "$orderItems.product",

          totalSold: {
            $sum: "$orderItems.quantity",
          },
        },
      },

      {
        $sort: {
          totalSold: -1,
        },
      },

      {
        $limit: 10,
      },
    ]);

    res.status(200).json({
      success: true,

      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const recentOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({
        createdAt: -1,
      })
      .limit(10);

    res.status(200).json({
      success: true,

      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
