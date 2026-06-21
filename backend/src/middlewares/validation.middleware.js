
// Generic validator
const validateBody = (requiredFields = []) => {
  return (req, res, next) => {
    if (!req.body) {
      return res.status(400).json({
  success: false,
  message: "Request body is missing",
});
    }

    const missingFields = [];

    for (const field of requiredFields) {
      if (
        req.body[field] === undefined ||
        req.body[field] === null ||
        req.body[field] === ""
      ) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
  success: false,
  message: `Missing required fields: ${missingFields.join(", ")}`,
});
    }

    next();
  };
};

module.exports = {
  validateBody,
};