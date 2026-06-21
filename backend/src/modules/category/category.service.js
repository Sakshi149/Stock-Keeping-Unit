const prisma = require("../../config/prisma");

exports.createCategory = async (data) => {
  const { name, codeFormat, fields, skuConfig } = data;
  const nameClean = name?.trim();
  const codeFormatClean = codeFormat?.trim();

  // ✅ VALIDATION
  if (!nameClean || !codeFormatClean) {
    throw new Error("Name and codeFormat are required");
  }

  if (!fields || fields.length === 0) {
    throw new Error("At least one field is required");
  }

  fields.forEach((field) => {
    if (!field.name || !field.type) {
      throw new Error("Each field must have name and type");
    }
  });

  const fieldNames = fields.map((f) => f.name.trim().toLowerCase());
  const hasDuplicates = new Set(fieldNames).size !== fieldNames.length;

  if (hasDuplicates) {
    throw new Error("Field names must be unique");
  }

  if (skuConfig) {
    if (!Array.isArray(skuConfig.parts)) {
      throw new Error("skuConfig.parts must be an array");
    }

    skuConfig.parts.forEach((part) => {
      // FIELD type
      if (!part.type || part.type === "FIELD") {
        if (!part.field || !part.rule) {
          throw new Error("FIELD type SKU parts require field and rule");
        }
      }

      // STATIC type
      if (part.type === "STATIC") {
        if (!part.value) {
          throw new Error("STATIC type SKU part requires value");
        }
      }

      // DATE type
      if (part.type === "DATE") {
        if (!part.format) {
          throw new Error("DATE type SKU part requires format");
        }
      }

      // SEQUENCE type
      if (part.type === "SEQUENCE" && !part.length) {
        part.length = 3;
      }
    });
  }

  try {
    const category = await prisma.category.create({
      data: {
        name: nameClean,
        codeFormat: codeFormatClean,
        skuConfig: skuConfig ? JSON.parse(JSON.stringify(skuConfig)) : null,
        fields: {
          create: fields.map((field, index) => ({
            name: field.name.trim(),
            type: field.type,
            isRequired: field.isRequired || false,
            orderIndex: index + 1,
          })),
        },
      },
      include: {
        fields: {
          orderBy: { orderIndex: "asc" },
        },
      },
    });

    return category;
  } catch (error) {
    if (error.code === "P2002") {
      throw new Error("Category name already exists");
    }
    throw error;
  }
};
// exports.getAllCategories = async () => {
//   const categories = await prisma.category.findMany({
//     include: {
//       fields: {
//         orderBy: { orderIndex: "asc" },
//       },
//     },
//   });

//   return categories;
// };

exports.getAllCategories = async (query = {}) => {

  const { name } = query;

  const categories = await prisma.category.findMany({

    where: name
      ? {
          name: {
            equals: name,
            mode: "insensitive"
          }
        }
      : {},

    include: {
      fields: {
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  return categories;
};

exports.updateCategory = async (id, data) => {
  const { name, codeFormat, fields, skuConfig } = data;

  const nameClean = name?.trim();
  const codeFormatClean = codeFormat?.trim();

  // ✅ VALIDATION
  if (!nameClean || !codeFormatClean) {
    throw new Error("Name and codeFormat are required");
  }

  if (!fields || fields.length === 0) {
    throw new Error("At least one field is required");
  }

  fields.forEach((field) => {
    if (!field.name || !field.type) {
      throw new Error("Each field must have name and type");
    }
  });

  const fieldNames = fields.map((f) => f.name.trim().toLowerCase());
  const hasDuplicates = new Set(fieldNames).size !== fieldNames.length;

  if (hasDuplicates) {
    throw new Error("Field names must be unique");
  }

  if (skuConfig) {
    if (!Array.isArray(skuConfig.parts)) {
      throw new Error("skuConfig.parts must be an array");
    }

    skuConfig.parts.forEach((part) => {
      // FIELD type
      if (!part.type || part.type === "FIELD") {
        if (!part.field || !part.rule) {
          throw new Error("FIELD type SKU parts require field and rule");
        }
      }

      // STATIC type
      if (part.type === "STATIC") {
        if (!part.value) {
          throw new Error("STATIC type SKU part requires value");
        }
      }

      // DATE type
      if (part.type === "DATE") {
        if (!part.format) {
          throw new Error("DATE type SKU part requires format");
        }
      }

      // SEQUENCE type
      if (part.type === "SEQUENCE" && !part.length) {
        part.length = 3;
      }
    });
  }
  // 1. Check if exists
  const existing = await prisma.category.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Category not found");
  }

  // 2. Delete old fields
  await prisma.categoryField.deleteMany({
    where: { categoryId: id },
  });

  try {
    // 3. Update category + recreate fields
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: nameClean,
        codeFormat: codeFormatClean,
        skuConfig: skuConfig ? JSON.parse(JSON.stringify(skuConfig)) : null,
        fields: {
          create: fields.map((field, index) => ({
            name: field.name.trim(),
            type: field.type,
            isRequired: field.isRequired || false,
            orderIndex: index + 1,
          })),
        },
      },
      include: {
        fields: {
          orderBy: { orderIndex: "asc" },
        },
      },
    });

    return updatedCategory;
  } catch (error) {
    if (error.code === "P2002") {
      throw new Error("Category name already exists");
    }
    throw error;
  }
};

exports.deleteCategory = async (id) => {
  const existing = await prisma.category.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Category not found");
  }

  await prisma.category.delete({
    where: { id },
  });

  return { message: "Category deleted successfully" };
};

exports.getCategoryById = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      fields: {
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};
