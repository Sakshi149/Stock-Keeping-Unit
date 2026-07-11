const prisma = require("../../config/prisma");

exports.createCategory = async (data, user) => {
  if (!user?.companyId) {
    throw new Error("Invalid company");
  }

  const { name, codeFormat, fields, skuConfig } = data;

  const nameClean = name?.trim();
  const codeFormatClean = codeFormat?.trim();

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

  if (new Set(fieldNames).size !== fieldNames.length) {
    throw new Error("Field names must be unique");
  }

  if (skuConfig) {
    if (!Array.isArray(skuConfig.parts)) {
      throw new Error("skuConfig.parts must be an array");
    }

    skuConfig.parts.forEach((part) => {
      if ((!part.type || part.type === "FIELD") && (!part.field || !part.rule)) {
        throw new Error("FIELD type SKU parts require field and rule");
      }

      if (part.type === "STATIC" && !part.value) {
        throw new Error("STATIC type SKU part requires value");
      }

      if (part.type === "DATE" && !part.format) {
        throw new Error("DATE type SKU part requires format");
      }

      if (part.type === "SEQUENCE" && !part.length) {
        part.length = 3;
      }
    });
  }

  try {
    return await prisma.category.create({
      data: {
        companyId: user.companyId,
        name: nameClean,
        codeFormat: codeFormatClean,
        skuConfig: skuConfig
          ? JSON.parse(JSON.stringify(skuConfig))
          : null,

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
          orderBy: {
            orderIndex: "asc",
          },
        },
      },
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw new Error(
        "A category with this name already exists in your company."
      );
    }

    throw error;
  }
};

exports.getAllCategories = async (query = {}, user) => {
  if (!user?.companyId) {
    throw new Error("Invalid company");
  }

  const { name } = query;

  return prisma.category.findMany({
    where: {
      companyId: user.companyId,

      ...(name && {
        name: {
          equals: name,
          mode: "insensitive",
        },
      }),
    },

    include: {
      fields: {
        orderBy: {
          orderIndex: "asc",
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

exports.getCategoryById = async (id, user) => {
  if (!user?.companyId) {
    throw new Error("Invalid company");
  }

  const category = await prisma.category.findFirst({
    where: {
      id,
      companyId: user.companyId,
    },

    include: {
      fields: {
        orderBy: {
          orderIndex: "asc",
        },
      },
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};

exports.updateCategory = async (id, data, user) => {
  if (!user?.companyId) {
    throw new Error("Invalid company");
  }

  const { name, codeFormat, fields, skuConfig } = data;

  const nameClean = name?.trim();
  const codeFormatClean = codeFormat?.trim();

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

  if (new Set(fieldNames).size !== fieldNames.length) {
    throw new Error("Field names must be unique");
  }

  const existing = await prisma.category.findFirst({
    where: {
      id,
      companyId: user.companyId,
    },
  });

  if (!existing) {
    throw new Error("Category not found");
  }

  try {
    return await prisma.$transaction(async (tx) => {
      await tx.categoryField.deleteMany({
        where: {
          categoryId: existing.id,
        },
      });

      return tx.category.update({
        where: {
          id: existing.id,
        },

        data: {
          name: nameClean,
          codeFormat: codeFormatClean,
          skuConfig: skuConfig
            ? JSON.parse(JSON.stringify(skuConfig))
            : null,

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
            orderBy: {
              orderIndex: "asc",
            },
          },
        },
      });
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw new Error(
        "A category with this name already exists in your company."
      );
    }

    throw error;
  }
};

exports.deleteCategory = async (id, user) => {
  if (!user?.companyId) {
    throw new Error("Invalid company");
  }

  const existing = await prisma.category.findFirst({
    where: {
      id,
      companyId: user.companyId,
    },
  });

  if (!existing) {
    throw new Error("Category not found");
  }

  await prisma.category.delete({
    where: {
      id: existing.id,
    },
  });

  return {
    message: "Category deleted successfully",
  };
};