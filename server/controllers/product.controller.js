import Product from "../models/Product.model.js";

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const category = req.query.category;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    let query = {
      isDeleted: false,

      name: {
        $regex: keyword,
        $options: "i",
      },
    };

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};

      if (req.query.minPrice) {
        query.price.$gte = Number(req.query.minPrice);
      }

      if (req.query.maxPrice) {
        query.price.$lte = Number(req.query.maxPrice);
      }
    }

    let products = Product.find(query).populate("category", "name slug");

    // Sorting
    if (req.query.sort === "price") {
      products = products.sort({
        price: 1,
      });
    } else if (req.query.sort === "-price") {
      products = products.sort({
        price: -1,
      });
    } else {
      products = products.sort({
        createdAt: -1,
      });
    }

    products = products.skip(skip).limit(limit);

    const result = await products;

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      products: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name slug",
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.isDeleted = true;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isFeatured: true,
      isDeleted: false,
    }).limit(8);

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

export const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const products = await Product.find({
      category: product.category,

      _id: {
        $ne: product._id,
      },

      isDeleted: false,
    })
      .populate("category", "name slug")
      .limit(8);

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

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.isFeatured = !product.isFeatured;

    await product.save();

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const softDeleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
    });

    res.status(200).json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const restoreProduct = async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, {
      isDeleted: false,
    });

    res.status(200).json({
      success: true,
      message: "Product restored",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      $expr: {
        $lte: ["$stock", "$lowStockThreshold"],
      },
    });

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

export const bulkDeleteProducts = async (req, res) => {
  try {
    await Product.updateMany(
      {
        _id: {
          $in: req.body.productIds,
        },
      },
      {
        isDeleted: true,
      },
    );

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBoughtTogetherProducts = async (req, res) => {
  try {
    const productId = req.params.id;

    const orders = await Order.find({
      "orderItems.product": productId,
    });

    const productMap = {};

    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        if (item.product.toString() !== productId) {
          productMap[item.product] = (productMap[item.product] || 0) + 1;
        }
      });
    });

    const ids = Object.keys(productMap);

    const products = await Product.find({
      _id: {
        $in: ids,
      },
      isDeleted: false,
    }).limit(8);

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

export const getTopSellingProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isDeleted: false,
    })
      .sort({
        soldCount: -1,
      })
      .limit(10);

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

export const getLatestProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isDeleted: false,
    })
      .sort({
        createdAt: -1,
      })
      .limit(10);

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

export const getTrendingProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isDeleted: false,
    })
      .sort({
        views: -1,
      })
      .limit(10);

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

export const getRecentlyViewedProducts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("recentlyViewed");

    res.status(200).json({
      success: true,

      products: user.recentlyViewed,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const compareProducts = async (req, res) => {
  try {
    const products = await Product.find({
      _id: {
        $in: [req.query.id1, req.query.id2],
      },
    });

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

export const addFAQ = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.faqs.push({
      question: req.body.question,
      answer: req.body.answer,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "FAQ added",
      faqs: product.faqs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getFAQs = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select("faqs");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      faqs: product.faqs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateFAQ = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const faq = product.faqs.id(req.params.faqId);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    faq.question = req.body.question || faq.question;

    faq.answer = req.body.answer || faq.answer;

    await product.save();

    res.status(200).json({
      success: true,
      message: "FAQ updated",
      faq,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteFAQ = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const faq = product.faqs.id(req.params.faqId);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    faq.deleteOne();

    await product.save();

    res.status(200).json({
      success: true,
      message: "FAQ deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const reportProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Prevent duplicate reports

    const alreadyReported = product.reports.some(
      (report) => report.user.toString() === req.user._id.toString(),
    );

    if (alreadyReported) {
      return res.status(400).json({
        success: false,
        message: "You have already reported this product",
      });
    }

    product.reports.push({
      user: req.user._id,
      reason: req.body.reason,
    });

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product reported successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getReportedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      "reports.0": {
        $exists: true,
      },
    }).populate("reports.user", "name email");

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

export const removeReport = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.reports = product.reports.filter(
      (report) => report._id.toString() !== req.params.reportId,
    );

    await product.save();

    res.status(200).json({
      success: true,
      message: "Report removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
