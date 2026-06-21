const express = require("express");

const router = express.Router();

const itemController = require("./item.controller");

const authMiddleware = require("../../middlewares/auth.middleware");

const { validateBody } = require("../../middlewares/validation.middleware");


// PREVIEW ITEM CODE
router.post(
  "/preview",
  authMiddleware,
  validateBody(["categoryId", "fields"]),
  itemController.previewItemCode
);


// CREATE ITEM
router.post(
  "/",
  authMiddleware,
  validateBody(["categoryId", "fields"]),
  itemController.createItem
);


// GET ALL ITEMS
router.get(
  "/",
  authMiddleware,
  itemController.getItems
);


// GET ITEM BY CODE
router.get(
  "/code/:code",
  authMiddleware,
  itemController.getItemByCode
);


// GET ITEM BY ID
router.get(
  "/:id",
  authMiddleware,
  itemController.getItemById
);


// UPDATE ITEM
router.put(
  "/:id",
  authMiddleware,
  validateBody(["fields"]),
  itemController.updateItem
);


// DELETE ITEM
router.delete(
  "/:id",
  authMiddleware,
  itemController.deleteItem
);

module.exports = router;