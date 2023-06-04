const { Op } = require("sequelize");
const { user, post, follower } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const { username } = req.params;

    const userDetail = await user.findOne({
      attributes: {
        exclude: [
          "password",
          "is_verification",
          "otp",
          "date_verification",
          "role",
        ],
      },
      where: {
        username: username,
      },
      include: [
        {
          model: post,
        },
        {
          model: follower,
          required: false,
          where: {
            followerId: req.user.id,
          },
        },
      ],
    });

    return res.json({
      message: "Success",
      data: userDetail,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: error?.errors || "Server Internal Error",
    });
  }
};
