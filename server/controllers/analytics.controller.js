import Product from "../models/Product.model.js";
import Order from "../models/Order.model.js";
import User from "../models/User.model.js";

export const categoryAnalytics = async (req, res) => {
  try {
    const analytics = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          totalProducts: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          totalProducts: -1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      analytics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const orderStatusAnalytics = async (req, res) => {
  try {
    const analytics = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",

          count: {
            $sum: 1,
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      analytics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const userGrowthAnalytics = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt",
            },
          },

          totalUsers: {
            $sum: 1,
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
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
