const validateCategory = (req, res, next) => {
  const { name, codeFormat, fields } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({
      success: false,
      message: "Category name is required",
    });
  }

  if (!codeFormat || !codeFormat.trim()) {
    return res.status(400).json({
      success: false,
      message: "Code format is required",
    });
  }

  if (!Array.isArray(fields) || fields.length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one field is required",
    });
  }

  for (const field of fields) {
    if (!field.name || !field.name.trim() || !field.type) {
      return res.status(400).json({
        success: false,
        message: "Each field must have name and type",
      });
    }
  }

  next();
};

module.exports = {
  validateCategory,
};