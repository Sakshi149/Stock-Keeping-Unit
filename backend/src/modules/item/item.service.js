const prisma = require("../../config/prisma");
const { validateItem } = require("./item.validation");
const { generateCode } = require("./codeGenerator");

const createItem = async (data, user) => {
  if (!user?.companyId) {
    throw new Error("Invalid company");
  }

  const { categoryId, itemName, fields = {}, description = "", rate } = data; // ✅ 1. Check category
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      companyId: user.companyId,
    },
    include: {
      fields: true,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const normalizedFields = {};
  Object.keys(fields).forEach((key) => {
    normalizedFields[key.trim().toUpperCase()] = fields[key];
  });

  const allowedFieldNames = category.fields.map((f) => f.name.toUpperCase());

  for (const key in normalizedFields) {
    if (!allowedFieldNames.includes(key)) {
      throw new Error(`Invalid field: ${key}`);
    }
  }

  const errors = validateItem(category.fields, normalizedFields);
  if (errors.length) {
    throw new Error(errors.join(", "));
  }

  if (rate !== undefined && isNaN(rate)) {
    throw new Error("Rate must be a number");
  }

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

    const existingCode = await tx.item.findFirst({
      where: {
        companyId: user.companyId,
        code,
      },
    });

    if (existingCode) {
      throw new Error("Generated code already exists");
    }

    return await tx.item.create({
      data: {
        companyId: user.companyId,
        categoryId,
        code,
        itemName: itemName || normalizedFields.NAME || null,
        description,
        rate: rate !== undefined ? Number(rate) : null,
        fields: normalizedFields,
      },
    });
  });
};

const getItems = async (query = {}, user) => {
  if (!user?.companyId) {
    throw new Error("Invalid company");
  }
  const { search, categoryId } = query;

  return await prisma.item.findMany({
    where: {
      companyId: user.companyId,

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

const getItemById = async (id, user) => {
  if (!user?.companyId) {
    throw new Error("Invalid company");
  }
  const item = await prisma.item.findFirst({
    where: {
      id,
      companyId: user.companyId,
    },
    include: {
      category: true,
    },
  });

  if (!item) {
    throw new Error("Item not found");
  }

  return item;
};

const getItemByCode = async (code, user) => {
  if (!user?.companyId) {
    throw new Error("Invalid company");
  }

  return await prisma.item.findFirst({
    where: {
      code,
      companyId: user.companyId,
    },
    include: {
      category: true,
    },
  });
};

const previewCode = async (data, user) => {
  if (!user?.companyId) {
    throw new Error("Invalid company");
  }
  const { categoryId, fields = {}, description = "", rate } = data;

  const category = await prisma.category.findFirst({
    where: { id: categoryId, companyId: user.companyId },
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
    where: {
      categoryId: category.id,
    },
  });

  const nextNumber = sequence
    ? (sequence.current || 0) + (sequence.step || 1)
    : 1;

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

const updateItem = async (id, data, user) => {
  if (!user?.companyId) {
    throw new Error("Invalid company");
  }
  const existing = await prisma.item.findFirst({
    where: { id, companyId: user.companyId },
    include: { category: { include: { fields: true } } },
  });

  if (!existing) {
    throw new Error("Item not found");
  }

  const { itemName, fields = {}, description, rate } = data;

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

  const seqMatch = existing.code.match(/(\d+)$/);

  const sequenceNumber = seqMatch ? Number(seqMatch[1]) : 1;

  const newCode = generateCode(
    existing.category,
    normalizedFields,
    sequenceNumber,
  );

  return await prisma.item.update({
    where: { id },
    data: {
      code: newCode,
      ...(itemName !== undefined && {
        itemName,
      }),
      fields: normalizedFields,
      ...(description !== undefined && { description }),
      ...(rate !== undefined && { rate: Number(rate) }),
    },
  });
};

const deleteItem = async (id, user) => {
  if (!user?.companyId) {
    throw new Error("Invalid company");
  }
  const existing = await prisma.item.findFirst({
    where: { id, companyId: user.companyId },
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