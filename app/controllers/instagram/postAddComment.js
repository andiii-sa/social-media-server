const { post_comment } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const { text } = req.body;
    const { id } = req.params;

    const createCommentPost = await post_comment.create({
      userId: req.user.id,
      postId: id,
      text: text,
    });

    return res.json({
      message: "Success",
      data: createCommentPost,
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
