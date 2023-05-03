const { user } = require("../../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_ACCESS_TOKEN_EXPIRED } = process.env;
const { loginValidation } = require("../../utils/validator/validation");

module.exports = async (req, res) => {
  try {
    const { email, password } = req.body;

    loginValidation(req, res);

    const hasUser = await user.findOne({
      where: {
        email: email,
      },
    });

    if (!hasUser) {
      return res.status(404).json({
        message: "Akun tidak ditemukan",
      });
    }

    const isValidPassword = await bcrypt.compare(password, hasUser.password);
    if (!isValidPassword)
      return res.status(409).json({
        message: "Email atau password salah",
      });

    const token = jwt.sign(
      {
        id: hasUser.id,
        username: hasUser.username,
        role: hasUser.role,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_ACCESS_TOKEN_EXPIRED,
      }
    );

    return res.json({
      message: "Success login",
      data: {
        token: token,
        name: hasUser.name,
        username: hasUser.username,
        role: hasUser.role,
        email: hasUser.email,
        photo: hasUser.photo,
      },
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: error?.errors || "Server Internal Error",
    });
  }
};
