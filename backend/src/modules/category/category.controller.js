const service = require("./category.service");

exports.createCategory = async (req, res, next) => {
  try {
    const category = await service.createCategory(req.body, req.user);

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await service.getAllCategories(req.query, req.user);

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await service.getCategoryById(req.params.id, req.user);

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await service.updateCategory(
      req.params.id,
      req.body,
      req.user
    );

    res.json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const result = await service.deleteCategory(req.params.id, req.user);

    res.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};