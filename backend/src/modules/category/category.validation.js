const validateCategory = (req, res, next) => {
  const { name, codeFormat, fields } = req.body;

  // Basic validation
  if (!name || !codeFormat) {
    return res.status(400).json({
      success: false,
      message: "Name and codeFormat are required",
    });
  }

  if (!fields || !Array.isArray(fields) || fields.length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one field is required",
    });
  }

  for (const field of fields) {
    if (!field.name || !field.type) {
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