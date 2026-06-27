import mongoose from "mongoose";
import slugify from "slugify";
import Category from "../models/Category.model.js";
import Product from "../models/Product.model.js";

// ============================
// CREATE CATEGORY
// ============================
export const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category with this name already exists",
      });
    }

    // Generate slug from name
    const slug = slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    });

    // Check if slug already exists
    const existingSlug = await Category.findOne({ slug });
    if (existingSlug) {
      return res.status(400).json({
        success: false,
        message: "Category with this slug already exists",
      });
    }

    const category = await Category.create({
      name: name.trim(),
      slug,
      description: description || "",
      image: image || "",
      isActive: true,
      isDeleted: false,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// GET ALL CATEGORIES
// ============================
export const getCategories = async (req, res) => {
  try {
    const { keyword = "", isActive, isDeleted } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};

    // Search by keyword in name or description
    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    // Filter by active status
    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    // Filter by deleted status
    if (isDeleted !== undefined) {
      filter.isDeleted = isDeleted === "true";
    } else {
      // By default, only show non-deleted categories
      filter.isDeleted = false;
    }

    const categories = await Category.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Category.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        categories,
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

// ============================
// GET SINGLE CATEGORY
// ============================
export const getCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// GET CATEGORY BY SLUG
// ============================
export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({
      slug,
      isDeleted: false,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// UPDATE CATEGORY
// ============================
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image, isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    // Check if category exists
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Build update object
    const updateData = {};

    if (name && name.trim() !== existingCategory.name) {
      // Check if new name already exists
      const nameExists = await Category.findOne({
        name: name.trim(),
        _id: { $ne: id },
      });
      if (nameExists) {
        return res.status(400).json({
          success: false,
          message: "Category with this name already exists",
        });
      }

      updateData.name = name.trim();
      updateData.slug = slugify(name, {
        lower: true,
        strict: true,
        trim: true,
      });
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    if (image !== undefined) {
      updateData.image = image;
    }

    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    const category = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// SOFT DELETE CATEGORY
// ============================
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if category has products
    const productCount = await Product.countDocuments({
      category: id,
      isDeleted: false,
    });

    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${productCount} associated products.`,
      });
    }

    // Soft delete
    category.isDeleted = true;
    category.isActive = false;
    await category.save();

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// PERMANENT DELETE CATEGORY
// ============================
export const permanentDeleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if category has products
    const productCount = await Product.countDocuments({
      category: id,
    });

    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${productCount} associated products.`,
      });
    }

    // Permanent delete
    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Category permanently deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// RESTORE CATEGORY
// ============================
export const restoreCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    category.isDeleted = false;
    category.isActive = true;
    await category.save();

    res.status(200).json({
      success: true,
      message: "Category restored successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// GET PRODUCTS BY CATEGORY
// ============================
export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category || category.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const products = await Product.find({
      category: categoryId,
      isDeleted: false,
      isActive: true,
    })
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments({
      category: categoryId,
      isDeleted: false,
      isActive: true,
    });

    res.status(200).json({
      success: true,
      data: {
        category: {
          id: category._id,
          name: category.name,
          slug: category.slug,
        },
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

// ============================
// BULK DELETE CATEGORIES
// ============================
export const bulkDeleteCategories = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of category IDs",
      });
    }

    // Check if any category has products
    const categoriesWithProducts = await Category.find({
      _id: { $in: ids },
      isDeleted: false,
    });

    let hasProducts = false;
    for (const category of categoriesWithProducts) {
      const productCount = await Product.countDocuments({
        category: category._id,
        isDeleted: false,
      });
      if (productCount > 0) {
        hasProducts = true;
        break;
      }
    }

    if (hasProducts) {
      return res.status(400).json({
        success: false,
        message:
          "Some categories have associated products. Please remove products first.",
      });
    }

    // Soft delete all categories
    const result = await Category.updateMany(
      { _id: { $in: ids } },
      { isDeleted: true, isActive: false },
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} categories deleted successfully`,
      data: {
        deletedCount: result.modifiedCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// TOGGLE CATEGORY STATUS
// ============================
export const toggleCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    category.isActive = !category.isActive;
    await category.save();

    res.status(200).json({
      success: true,
      message: `Category ${category.isActive ? "activated" : "deactivated"} successfully`,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// GET CATEGORY STATISTICS
// ============================
export const getCategoryStats = async (req, res) => {
  try {
    const totalCategories = await Category.countDocuments({ isDeleted: false });
    const activeCategories = await Category.countDocuments({
      isDeleted: false,
      isActive: true,
    });
    const inactiveCategories = await Category.countDocuments({
      isDeleted: false,
      isActive: false,
    });
    const deletedCategories = await Category.countDocuments({
      isDeleted: true,
    });

    res.status(200).json({
      success: true,
      data: {
        total: totalCategories,
        active: activeCategories,
        inactive: inactiveCategories,
        deleted: deletedCategories,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
