// const prisma = require("../../config/prisma");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// const JWT_SECRET = process.env.JWT_SECRET;

// exports.register = async ({ email, password }) => {
//   const existingUser = await prisma.user.findUnique({ where: { email } });

//   if (existingUser) {
//     throw new Error("User already exists");
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);

//   const user = await prisma.user.create({
//     data: {
//       email,
//       password: hashedPassword,
//     },
//   });

//   return user;
// };

// exports.login = async ({ email, password }) => {
//   const user = await prisma.user.findUnique({ where: { email } });

//   if (!user) {
//     throw new Error("Invalid credentials");
//   }

//   const isMatch = await bcrypt.compare(password, user.password);

//   if (!isMatch) {
//     throw new Error("Invalid credentials");
//   }

//   const token = jwt.sign(
//     { userId: user.id, email: user.email },
//     JWT_SECRET,
//     { expiresIn: "1d" }
//   );

//   return { token };
// };

const prisma = require("../../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async ({ name, email, password }) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordRegex.test(password)) {
    throw new Error(
      "Password must be minimum 8 characters and include uppercase, lowercase, number and special character",
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return {
    id: user.id,
    email: user.email,
  };
};

exports.login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      userId: user.id,
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
    },
  };
};
