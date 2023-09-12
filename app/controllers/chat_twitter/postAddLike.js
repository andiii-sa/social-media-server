const { post, post_like } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const { is_like } = req.body;
    const { id } = req.params;

    let createLikePost;
    if (is_like) {
      createLikePost = await post_like.create({
        userId: req.user.id,
        postId: id,
      });
    } else {
      createLikePost = await post_like.destroy({
        where: {
          userId: req.user.id,
          postId: id,
        },
      });
    }

    return res.json({
      message: "Success",
      data: createLikePost,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: error?.errors || "Server Internal Error",
    });
  }
};
