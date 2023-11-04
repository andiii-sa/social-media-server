const {
  user,
  post,
  post_comment,
  post_like,
  Sequelize,
} = require("../../../models");

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    // SELECT CASE WHEN EXISTS (
    //     SELECT *
    //     FROM post_likes
    //     WHERE userId= 'ebf88b5c-2f99-482f-9cb2-9384683c7efb' AND postId = '3fe68bf4-a2fa-42e2-a22e-01f1718874972'
    // )
    // THEN 'true'
    // ELSE 'false' END
    // AS is_like;
    let postDetail = {};
    postDetail = await post.findOne({
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
      where: {
        id: id,
      },
      include: [
        {
          model: user,
          attributes: {
            exclude: [
              "password",
              "is_verification",
              "otp",
              "date_verification",
              "role",
            ],
          },
        },
        {
          model: post_comment,
          include: [
            {
              model: user,
              attributes: {
                exclude: [
                  "password",
                  "is_verification",
                  "otp",
                  "date_verification",
                  "role",
                ],
              },
            },
          ],
        },
        {
          model: post_like,
        },
      ],
      order: [[{ model: post_comment }, "createdAt", "DESC"]],
    });

    if (!postDetail) {
      return res.status(404).json({
        message: "Post tidak ditemukan",
        meta: {
          status: 404,
        },
      });
    }
    postDetail.dataValues.is_like = postDetail?.post_likes?.some(
      (s) => s?.userId === req?.user?.id
    );

    return res.json({
      message: "Success",
      data: postDetail,
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
