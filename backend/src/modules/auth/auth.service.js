const prisma = require("../../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async ({ companyName, name, email, password }) => {
  console.log("=========== REGISTER REQUEST ===========");
  console.log({
    companyName,
    name,
    email,
    password,
  });
  console.log("========================================");
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordRegex.test(password)) {
    throw new Error(
      "Password must be minimum 8 characters and include uppercase, lowercase, number and special character",
    );
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  let company = await prisma.company.findFirst({
    where: {
      name: {
        equals: companyName.trim(),
        mode: "insensitive",
      },
    },
    include: {
      users: true,
    },
  });

  let role = "USER";

  if (!companyName?.trim()) {
    throw new Error("Company name is required");
  }

  if (!company) {
    company = await prisma.company.create({
      data: {
        name: companyName.trim(),
      },
      include: {
        users: true,
      },
    });

    role = "ADMIN";
  } else {
    if (company.users.length === 0) {
      role = "ADMIN";
    }
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      companyId: company.id,
      role,
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    company: company.name,
  };
};

exports.login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const company = await prisma.company.findUnique({
    where: {
      id: user.companyId,
    },
  });

  const token = jwt.sign(
    {
      userId: user.id,
      companyId: user.companyId,
      role: user.role,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "1d" },
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      companyName: company.name,
    },
  };
};