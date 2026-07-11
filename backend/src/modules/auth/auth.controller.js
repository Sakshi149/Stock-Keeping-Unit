const authService = require("./auth.service");

exports.register = async (req, res) => {
  try {
    const user = await authService.register(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);

    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const result = await authService.login(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};
