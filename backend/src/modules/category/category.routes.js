const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/auth.middleware");
const controller = require("./category.controller");
const { validateCategory } = require("./category.validation");

router.post("/", authMiddleware, validateCategory, controller.createCategory);

router.get("/", authMiddleware, controller.getAllCategories);

router.get("/:id", authMiddleware, controller.getCategoryById);

router.put("/:id", authMiddleware, validateCategory, controller.updateCategory);

router.delete("/:id", authMiddleware, controller.deleteCategory);

module.exports = router;