const validateItem = (categoryFields, inputFields) => {
  const errors = [];

  for (const field of categoryFields) {
const value = inputFields[field.name.toUpperCase()];

    if (field.isRequired && (value === undefined || value === null || value === "")) {
      errors.push(`${field.name} is required`);
      continue;
    }

    if (value !== undefined && value !== null) {
      switch (field.type) {
        case "NUMBER":
          if (isNaN(value)) {
            errors.push(`${field.name} must be a number`);
          }
          break;

        case "BOOLEAN":
          if (typeof value !== "boolean") {
            errors.push(`${field.name} must be boolean`);
          }
          break;

        case "DATE":
          if (isNaN(Date.parse(value))) {
            errors.push(`${field.name} must be a valid date`);
          }
          break;

        case "DROPDOWN":
          if (field.options && !field.options.includes(value)) {
            errors.push(`${field.name} must be one of ${field.options}`);
          }
          break;
      }
    }
  }

  return errors;
};

module.exports = {
  validateItem,
};