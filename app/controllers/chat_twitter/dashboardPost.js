const { Op } = require("sequelize");
const {
  user,
  chat_member,
  chat_message,
  chat,
  post,
  following,
  follower,
  post_like,
  Sequelize,
} = require("../../../models");

module.exports = async (req, res) => {
  try {
    const listPost = await post.findAll({
      where: {
        [Op.or]: [
          {
            userId: req.user.id,
          },
          Sequelize.where(
            Sequelize.fn("char_length", Sequelize.col("user.followers.id")),
            {
              [Op.gt]: 1,
            }
          ),
        ],
      },
      order: [["createdAt", "DESC"]],
      attributes: {
        include: [
          [
            Sequelize.literal(
              "(SELECT COUNT(*) WHERE post_likes.postId = post.id)"
            ),
            "post_like_count",
          ],
        ],
      },
      include: [
        {
          model: user,
          attributes: ["id", "username", "name", "photo"],
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
        },
        {
          model: post_like,
          required: false,
          attributes: [],
        },
      ],
    });

    // const mapPost = listPost?.filter(
    //   (f) => f?.userId === req.user.id || f?.user?.followers?.length > 0
    // );

    return res.json({
      message: "Success",
      data: listPost,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: error?.errors || "Server Internal Error",
    });
  }
};
