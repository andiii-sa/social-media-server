const { Op } = require("sequelize");
const { user, follower, Sequelize } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const { keywords = "", limit = 5, offset = 0 } = req.query;

    const listUser = await user.findAll({
      attributes: {
        include: [
          "id",
          "name",
          "username",
          "email",
          "photo",
          "createdAt",
          //   [
          //     Sequelize.fn("char_length", Sequelize.col("followers.id")),
          //     "lengthsss",
          //   ],
        ],
      },
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
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn("char_length", Sequelize.col("followers.id")),
            {
              [Op.eq]: null,
            }
          ),
          {
            id: {
              [Op.ne]: req.user.id,
            },
          },
        ],
      },
      include: [
        {
          model: follower,
          as: "followers",
          required: false,
          where: {
            followerId: req.user.id,
          },
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset * limit),
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
