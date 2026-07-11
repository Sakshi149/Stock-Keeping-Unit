const itemService = require("./item.service");

const createItem = async (req, res, next) => {
  try {
    const item = await itemService.createItem(req.body, req.user);
    res.status(201).json({
      success: true,
      message: "Item created successfully",
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

const previewItemCode = async (req, res, next) => {
  try {
    const code = await itemService.previewCode(req.body, req.user);
    res.json({
      success: true,
      data: { code },
    });
  } catch (error) {
    next(error);
  }
};

const getItems = async (req, res, next) => {
  try {
    const items = await itemService.getItems(req.query, req.user);

    res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

const getItemById = async (req, res, next) => {
  try {
    const item = await itemService.getItemById(req.params.id, req.user);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

const getItemByCode = async (req, res, next) => {
  try {
    const item = await itemService.getItemByCode(req.params.code, req.user);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const item = await itemService.updateItem(
      req.params.id,
      req.body,
      req.user,
    );
    res.json({
      success: true,
      message: "Item updated successfully",
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const result = await itemService.deleteItem(req.params.id, req.user);
    res.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createItem,
  getItems,
  getItemById,
  getItemByCode,
  previewItemCode,
  updateItem,
  deleteItem,
};