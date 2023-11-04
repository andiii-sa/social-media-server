const { user } = require("../../../models");
const bcrypt = require("bcrypt");
const { registerValidation } = require("../../utils/validator/validation");
module.exports = async (req, res) => {
  try {
    const { email, password } = req.body;

    registerValidation(req, res);

    const hasUser = await user.findOne({
      where: {
        email: email,
      },
    });

    if (hasUser) {
      return res.status(409).json({
        message: "Email telah terdaftar",
        meta: {
          status: 409,
        },
      });
    }

    const passwordCrypt = await bcrypt.hash(password, 13);

    const data = {
      ...req.body,
      password: passwordCrypt,
    };
    const createUser = await user.create(data);

    return res.json({
      message: "Success register",
      data: {
        email: createUser.email,
        username: createUser.username,
      },
      meta: {
        status: 200,
      },
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: error?.errors || "Server Internal Error",
      meta: {
        status: 500,
      },
    });
  }
};
