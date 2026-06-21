const express = require("express");
const router = express.Router();

const categoryRoutes = require("../modules/category/category.routes");

router.use("/categories", categoryRoutes);

module.exports = router;