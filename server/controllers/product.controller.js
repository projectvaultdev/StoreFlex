import Product from "../models/Product.model.js";
import slugify from "slugify";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      shortDescription,
      brand,
      category,
      price,
      discountPrice,
      stock,
      sku,
      isFeatured,
    } = req.body;

    let images = [];

    // Upload Multiple Images
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.buffer),
      );

      const results = await Promise.all(uploadPromises);

      images = results.map((result) => ({
        url: result.secure_url,
        publicId: result.public_id,
      }));
    }

    const product = await Product.create({
      name,
      slug: slugify(name, {
        lower: true,
        strict: true,
      }),
      description,
      shortDescription,
      brand,
      category,
      price,
      discountPrice,
      stock,
      sku,
      isFeatured,
      images,
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);

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
    const brand = req.query.brand;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const minRating = req.query.minRating;
    const inStock = req.query.inStock;
    const sort = req.query.sort || "-createdAt";

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;

    const skip = (page - 1) * limit;

    let query = {
      isDeleted: false,
      isActive: true,
    };

    // Search by keyword
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { brand: { $regex: keyword, $options: "i" } },
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Brand filter
    if (brand) {
      query.brand = brand;
    }

    // Price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Rating filter
    if (minRating) {
      query.averageRating = { $gte: Number(minRating) };
    }

    // Stock filter
    if (inStock === "true") {
      query.stock = { $gt: 0 };
    } else if (inStock === "false") {
      query.stock = { $lte: 0 };
    }

    // Build sort object
    let sortObj = {};
    if (sort === "-createdAt") {
      sortObj = { createdAt: -1 };
    } else if (sort === "createdAt") {
      sortObj = { createdAt: 1 };
    } else if (sort === "price-asc") {
      sortObj = { price: 1 };
    } else if (sort === "price-desc") {
      sortObj = { price: -1 };
    } else if (sort === "rating") {
      sortObj = { averageRating: -1 };
    } else if (sort === "best-selling") {
      sortObj = { soldCount: -1 };
    } else {
      sortObj = { createdAt: -1 };
    }

    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .populate("category", "name slug")
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
          hasMore: skip + limit < total,
        },
      },
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
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true },
    ).populate("category", "name slug");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        product,
      },
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
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const {
      name,
      description,
      shortDescription,
      brand,
      category,
      price,
      discountPrice,
      stock,
      sku,
      isFeatured,
    } = req.body;

    if (name) {
      product.name = name;
      product.slug = slugify(name, {
        lower: true,
        strict: true,
      });
    }

    if (description !== undefined) product.description = description;

    if (shortDescription !== undefined)
      product.shortDescription = shortDescription;

    if (brand !== undefined) product.brand = brand;

    if (category !== undefined) product.category = category;

    if (price !== undefined) product.price = price;

    if (discountPrice !== undefined) product.discountPrice = discountPrice;

    if (stock !== undefined) product.stock = stock;

    if (sku !== undefined) product.sku = sku;

    if (isFeatured !== undefined) product.isFeatured = isFeatured;

    // Upload new images
    if (req.files && req.files.length > 0) {
      // Delete old Cloudinary images
      if (product.images?.length > 0) {
        await Promise.all(
          product.images.map((img) =>
            cloudinary.uploader.destroy(img.publicId),
          ),
        );
      }

      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.buffer),
      );

      const results = await Promise.all(uploadPromises);

      product.images = results.map((result) => ({
        url: result.secure_url,
        publicId: result.public_id,
      }));
    }

    await product.save();

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);

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
    const limit = Number(req.query.limit) || 8;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const total = await Product.countDocuments({
      isFeatured: true,
      isDeleted: false,
      isActive: true,
    });

    const products = await Product.find({
      isFeatured: true,
      isDeleted: false,
      isActive: true,
    })
      .populate("category", "name slug")
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
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
    const limit = Number(req.query.limit) || 8;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const total = await Product.countDocuments({
      category: product.category,
      _id: { $ne: product._id },
      isDeleted: false,
      isActive: true,
    });

    const products = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isDeleted: false,
      isActive: true,
    })
      .populate("category", "name slug")
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
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
    const limit = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const total = await Product.countDocuments({
      isDeleted: false,
      isActive: true,
    });

    const products = await Product.find({
      isDeleted: false,
      isActive: true,
    })
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
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

// Get products by category with filters and pagination
export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const keyword = req.query.keyword || "";
    const brand = req.query.brand;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const minRating = req.query.minRating;
    const sort = req.query.sort || "-createdAt";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    let query = {
      category: categoryId,
      isDeleted: false,
      isActive: true,
    };

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    if (brand) {
      query.brand = brand;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (minRating) {
      query.averageRating = { $gte: Number(minRating) };
    }

    let sortObj = {};
    if (sort === "price-asc") {
      sortObj = { price: 1 };
    } else if (sort === "price-desc") {
      sortObj = { price: -1 };
    } else if (sort === "rating") {
      sortObj = { averageRating: -1 };
    } else if (sort === "best-selling") {
      sortObj = { soldCount: -1 };
    } else {
      sortObj = { createdAt: -1 };
    }

    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .populate("category", "name slug")
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
          hasMore: skip + limit < total,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get unique brands for filters
export const getBrands = async (req, res) => {
  try {
    const categoryId = req.query.category;
    let query = { isDeleted: false, isActive: true };

    if (categoryId) {
      query.category = categoryId;
    }

    const brands = await Product.distinct("brand", query);

    res.status(200).json({
      success: true,
      data: {
        brands: brands.filter((b) => b && b.length > 0),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get price range for filters
export const getPriceRange = async (req, res) => {
  try {
    const categoryId = req.query.category;
    let query = { isDeleted: false, isActive: true };

    if (categoryId) {
      query.category = categoryId;
    }

    const result = await Product.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
    ]);

    const { minPrice = 0, maxPrice = 0 } = result[0] || {};

    res.status(200).json({
      success: true,
      data: {
        minPrice,
        maxPrice,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
