const { Op } = require("sequelize");
const { user } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const { keywords = "", limit = 5, offset = 0 } = req.query;

    const listUser = await user.findAll({
      attributes: ["id", "name", "username", "email", "photo", "createdAt"],
      subQuery: false,
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
      limit: parseInt(limit),
      offset: parseInt(offset * limit),
      // offset: parseInt((offset - 1) * limit),
    });

    return res.json({
      message: "Success",
      data: listUser,
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
