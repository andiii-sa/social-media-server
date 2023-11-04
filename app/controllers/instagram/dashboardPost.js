const { Op } = require("sequelize");
const {
  user,
  post,
  follower,
  post_like,
  Sequelize,
  post_comment,
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
              "(SELECT COUNT(*) from post_likes WHERE post_likes.postId = post.id)"
            ),
            "post_like_count",
          ],
          [
            Sequelize.literal(
              "(SELECT COUNT(*) from post_comments WHERE post_comments.postId = post.id)"
            ),
            "post_comment_count",
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
          // required: false,
          attributes: ["id", "userId"],
        },
        {
          model: post_comment,
          // required: false,
        },
      ],
    });

    const mapPost = JSON.parse(JSON.stringify(listPost))?.map((post) => ({
      ...post,
      is_like: post?.post_likes?.some((s) => s?.userId === req?.user?.id),
    }));

    return res.json({
      message: "Success",
      data: mapPost,
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
