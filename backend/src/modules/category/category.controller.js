const service = require("./category.service");

exports.createCategory = async (req, res, next) => {
  try {
    console.log("BODY:", req.body); 

    const data = req.body;
    const category = await service.createCategory(data);

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category
    });

  } catch (error) {
    console.error("ERROR:", error.message);
next(error);
    
  }
};

// exports.getAllCategories = async (req, res, next) => {
//   try {
//     const categories = await service.getAllCategories();

//     res.json({
//       success: true,
//       data: categories
//     });

//   } catch (error) {
//     next(error);
//   }
// };

exports.getAllCategories = async (req, res, next) => {
  try {

    const categories = await service.getAllCategories(req.query);

    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    next(error);
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {

    const category = await service.getCategoryById(req.params.id);

    if (!category) {
  return res.status(404).json({
    success: false,
    message: "Category not found"
  });
}

    res.json({
      success: true,
      data: category
    });

  } catch (error) {
    next(error);
   
  }

};

exports.updateCategory = async (req, res, next) => {
  try {
     const category = await service.updateCategory(req.params.id, req.body);

     if (!category) {
  return res.status(404).json({
    success: false,
    message: "Category not found"
  });
}

   res.json({
      success: true,
      message: "Category updated successfully",
      data: category
    });

  } catch (error) {
    next(error);
  }

};

exports.deleteCategory = async (req, res, next) => {
  try {
    const result = await service.deleteCategory(req.params.id);

    if (!result) {
  return res.status(404).json({
    success: false,
    message: "Category not found"
  });
} 

    res.json({
      success: true,
      message: result.message
    });

  } catch (error) {
    next(error);
  }

};
