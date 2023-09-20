const { post_like } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    let createLikePost = {};
    const find = await post_like.findOne({
      where: {
        userId: req.user.id,
        postId: id,
      },
    });

    if (find) {
      createLikePost = await post_like.destroy({
        where: {
          userId: req.user.id,
          postId: id,
        },
      });
    } else {
      createLikePost = await post_like.create({
        userId: req.user.id,
        postId: id,
      });
    }

    const post_like_count = await post_like.count({
      where: {
        postId: id,
      },
    });

    return res.json({
      message: "Success",
      data: {
        ...createLikePost.dataValues,
        post_like_count,
        is_like: find ? false : true,
      },
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: error?.errors || "Server Internal Error",
    });
  }
};
