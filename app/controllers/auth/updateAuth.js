const { user } = require("../../../models");
const bcrypt = require("bcrypt");
const { registerValidation } = require("../../utils/validator/validation");
module.exports = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { id } = req.params;

    // registerValidation(req, res);

    const checkId = await user.findOne({
      where: {
        id: id,
      },
    });
    if (!checkId) {
      return res.status(404).json({
        message: "User tidak ditemukan",
        meta: {
          status: 404,
        },
      });
    }

    if (checkId?.email !== email) {
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
    }

    let data = req.body;
    if (password) {
      const passwordCrypt = await bcrypt.hash(password, 13);
      data = {
        ...data,
        password: passwordCrypt,
      };
    } else {
      delete data.password;
    }

    const updateUser = await user.update(data, {
      where: {
        id: id,
      },
    });

    return res.json({
      message: "Success update",
      data: {
        email: updateUser.email,
        username: updateUser.username,
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
