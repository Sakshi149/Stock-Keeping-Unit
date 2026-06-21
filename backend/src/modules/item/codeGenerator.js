const generateSkuFromConfig = (category, fields, sequenceNumber) => {
  const { skuConfig } = category;

  if (!skuConfig || !skuConfig.parts) {
    throw new Error("Invalid SKU configuration");
  }

  const separator = skuConfig.separator || "-";
  const parts = [];

  for (const part of skuConfig.parts) {
    if (part.rule === "SEQUENCE" || part.type === "SEQUENCE") {
      parts.push(String(sequenceNumber).padStart(part.length || 3, "0"));

      continue;
    }

    if (part.type === "STATIC") {
      parts.push(sanitize(part.value));

      continue;
    }

    if (part.type === "DATE") {
      const now = new Date();

      let value = "";

      if (part.format === "YY") {
        value = String(now.getFullYear()).slice(-2);
      }

      if (part.format === "YYYY") {
        value = String(now.getFullYear());
      }

      if (part.format === "MM") {
        value = String(now.getMonth() + 1).padStart(2, "0");
      }

      parts.push(value);

      continue;
    }

    const fieldKey = part.field?.toUpperCase();

    const value = fields[fieldKey];
    if (!value) continue;

    let result = "";

    if (part.rule === "FULL") {
      result = sanitize(value);
    }

    if (part.rule === "PREFIX") {
      result = sanitize(value.substring(0, part.length));
    }

    if (part.rule === "SUFFIX") {
      result = sanitize(value.slice(-part.length));
    }

    if (part.rule === "BOTH") {
      const prefix = value.substring(0, part.prefixLength);
      const suffix = value.slice(-part.suffixLength);
      result = sanitize(prefix + suffix);
    }

    parts.push(result);
  }

  return parts.join(separator);
};

const sanitize = (value) => {
  return String(value)
    .trim()
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase();
};

const generateFallbackCode = (category, fields, sequenceNumber) => {
  let code = category.codeFormat;

  code = code.replace("{SEQ}", String(sequenceNumber).padStart(3, "0"));

  for (const field of category.fields) {
    const key = field.name.toUpperCase();

    if (code.includes(`{${key}}`)) {
      const value = fields[key];

      if (!value) {
        throw new Error(`Missing value for ${key}`);
      }

      code = code.replace(`{${key}}`, sanitize(value));
    }
  }

  return code;
};

const generateCode = (category, fields, sequenceNumber) => {
  if (category.skuConfig?.parts?.length) {
    return generateSkuFromConfig(category, fields, sequenceNumber);
  }

  return generateFallbackCode(category, fields, sequenceNumber);
};

module.exports = {
  generateCode,
};
