const prisma = require("../../config/prisma");
const { validateItem } = require("./item.validation");
const { generateCode } = require("./codeGenerator");

// 🔥 Create Item
const createItem = async (data) => {
  console.log("🔥 BODY:", data);

  const {
  categoryId,
  fields = {},
  description = "",
  rate,
} = data;
  // ✅ 1. Check category
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: { fields: true },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  // ✅ 2. Normalize fields
  const normalizedFields = {};
  Object.keys(fields).forEach((key) => {
    normalizedFields[key.trim().toUpperCase()] = fields[key];
  });

  // ✅ 3. Validate allowed fields
  const allowedFieldNames = category.fields.map((f) => f.name.toUpperCase());

  for (const key in normalizedFields) {
    if (!allowedFieldNames.includes(key)) {
      throw new Error(`Invalid field: ${key}`);
    }
  }

  // ✅ 4. Validate required + type rules (IMPORTANT FIX)
  const errors = validateItem(category.fields, normalizedFields);
  if (errors.length) {
    throw new Error(errors.join(", "));
  }

if (rate !== undefined && isNaN(rate)) {
  throw new Error("Rate must be a number");
}
  // ✅ 5. Validate brand
  // const cleanBrand = typeof brand === "string" ? brand.trim() : "";

  // if (!cleanBrand) {
  //   throw new Error("brand is required");
  // }

  // ✅ 6. Transaction
  return await prisma.$transaction(async (tx) => {
    let sequence = await tx.sequence.findUnique({
      where: { categoryId: category.id },
    });

    if (!sequence) {
      sequence = await tx.sequence.create({
        data: { categoryId: category.id },
      });
    }

    const nextNumber = (sequence.current || 0) + (sequence.step || 1);

    const code = generateCode(category, normalizedFields, nextNumber);

    await tx.sequence.update({
      where: { categoryId: category.id },
      data: { current: nextNumber },
    });

    const existingCode = await tx.item.findUnique({
      where: { code },
    });

    if (existingCode) {
      throw new Error("Generated code already exists");
    }

    return await tx.item.create({
  data: {
    categoryId,
    code,
    description,
    rate: rate !== undefined ? Number(rate) : null,
    fields: normalizedFields,
  },
});
  });
};

// 🔥 Get All Items
const getItems = async (query = {}) => {
  const { search, categoryId } = query;

  return await prisma.item.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                { code: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        categoryId ? { categoryId } : {},
      ],
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// 🔥 Get Item by ID
const getItemById = async (id) => {
  const item = await prisma.item.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });

  if (!item) {
    throw new Error("Item not found");
  }

  return item;
};

const getItemByCode = async (code) => {
  return await prisma.item.findUnique({
    where: { code },
    include: {
      category: true,
    },
  });
};

// 🔥 Preview Code

const previewCode = async (data) => {
 const {
  categoryId,
  fields = {},
  description = "",
  rate,
} = data;

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: { fields: true },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const normalizedFields = {};
  Object.keys(fields).forEach((key) => {
    normalizedFields[key.trim().toUpperCase()] = fields[key];
  });

  let sequence = await prisma.sequence.findUnique({
    where: { categoryId },
  });

  const nextNumber = sequence
    ? (sequence.current || 0) + (sequence.step || 1)
    : 1;

  // ✅ Validation

  const errors = validateItem(category.fields, normalizedFields);
  if (errors.length) {
    throw new Error(errors.join(", "));
  }

if (rate !== undefined && isNaN(rate)) {
  throw new Error("Rate must be a number");
}

  const code = generateCode(category, normalizedFields, nextNumber);

  return code;
};

// 🔥 Update Item

const updateItem = async (id, data) => {
  const existing = await prisma.item.findUnique({
    where: { id },
    include: { category: { include: { fields: true } } },
  });

  if (!existing) {
    throw new Error("Item not found");
  }

  const { fields = {}, description, rate } = data;
  // const cleanBrand = typeof brand === "string" ? brand.trim() : "";

  // if (!cleanBrand) {
  //   throw new Error("brand is required");
  // }

  const normalizedFields = {};
  Object.keys(fields).forEach((key) => {
    normalizedFields[key.trim().toUpperCase()] = fields[key];
  });

  const allowed = existing.category.fields.map((f) => f.name.toUpperCase());

  for (const key in normalizedFields) {
    if (!allowed.includes(key)) {
      throw new Error(`Invalid field: ${key}`);
    }
  }

  const errors = validateItem(existing.category.fields, normalizedFields);
  if (errors.length) {
    throw new Error(errors.join(", "));
  }

  // EXTRACT OLD SEQUENCE FROM EXISTING CODE
  const seqMatch = existing.code.match(/(\d+)$/);

  const sequenceNumber = seqMatch ? Number(seqMatch[1]) : 1;

  console.log("OLD CODE:", existing.code);

  console.log("UPDATED FIELDS:", normalizedFields);

  console.log("CATEGORY SKU CONFIG:", existing.category.skuConfig);

  // REGENERATE CODE
  const newCode = generateCode(
    existing.category,
    normalizedFields,
    sequenceNumber,
  );

  return await prisma.item.update({
  where: { id },
  data: {
    code: newCode,
    fields: normalizedFields,
    ...(description !== undefined && { description }),
    ...(rate !== undefined && { rate: Number(rate) }),
  },
});
};

// 🔥 Delete Item

const deleteItem = async (id) => {
  const existing = await prisma.item.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Item not found");
  }

  await prisma.item.delete({
    where: { id },
  });

  return { message: "Item deleted successfully" };
};

module.exports = {
  createItem,
  getItems,
  getItemById,
  getItemByCode,
  previewCode,
  updateItem,
  deleteItem,
};
