const express = require("express");
const cors = require("cors");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Health Check Route
app.get("/", (req, res) => {
  res.send("🚀 Server is running");
});

// ✅ Routes (ONLY ONCE — no duplicates)
app.use("/api/auth", require("./modules/auth/auth.routes"));
app.use("/api/categories", require("./modules/category/category.routes"));
app.use("/api/items", require("./modules/item/item.routes"));

const errorHandler = require("./middlewares/error.middleware");

app.use(errorHandler);

module.exports = app; 
