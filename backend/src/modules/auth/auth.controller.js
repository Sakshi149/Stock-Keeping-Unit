// const fetch = require("node-fetch");

// exports.login = async (req, res) => {

//   try {

//     const response = await fetch(
//       "http://localhost:5000/api/auth/login",
//       {
//         method: "POST",

//         headers: {
//           "Content-Type": "application/json",
//         },

//         body: JSON.stringify({
//           email: req.body.email,
//           password: req.body.password,
//           portal: "ADMIN",
//         }),
//       }
//     );

//     const data = await response.json();

//     if (!response.ok) {
//       return res.status(response.status).json(data);
//     }

//     if (data.user.role !== "ADMIN") {

//       return res.status(403).json({
//         message: "Only admins can access Item Code Generator",
//       });
//     }

//     res.json(data);

//   } catch (error) {

//     console.error(error);

//     res.status(500).json({
//       message: "Unable to connect to Work Order auth server",
//     });
//   }
// };

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
    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};