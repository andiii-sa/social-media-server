const { Op } = require("sequelize");
const { user, chat_member, chat_message, chat } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const { keywords } = req.query;

    const listUser = await user.findAll({
      attributes: {
        exclude: ["password"],
      },
      where: {
        [Op.or]: [
          {
            username: {
              [Op.like]: `%${keywords}%`,
            },
          },
          {
            name: {
              [Op.like]: `%${keywords}%`,
            },
          },
        ],
      },
    });

    return res.json({
      message: "Success",
      data: listUser,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: error?.errors || "Server Internal Error",
    });
  }
};
