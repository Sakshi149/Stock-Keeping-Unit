const express = require("express");

const router = express.Router();

const itemController = require("./item.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const { validateBody } = require("../../middlewares/validation.middleware");

router.post(
  "/preview",
  authMiddleware,
  validateBody(["categoryId", "fields"]),
  itemController.previewItemCode
);

router.post(
  "/",
  authMiddleware,
  validateBody(["categoryId", "fields"]),
  itemController.createItem
);

router.get(
  "/",
  authMiddleware,
  itemController.getItems
);

router.get(
  "/code/:code",
  authMiddleware,
  itemController.getItemByCode
);

router.get(
  "/:id",
  authMiddleware,
  itemController.getItemById
);

router.put(
  "/:id",
  authMiddleware,
  validateBody(["fields"]),
  itemController.updateItem
);

router.delete(
  "/:id",
  authMiddleware,
  itemController.deleteItem
);

module.exports = router;