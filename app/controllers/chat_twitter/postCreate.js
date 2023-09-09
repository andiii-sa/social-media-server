const { post } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const { text } = req.body;
    let filename;
    if (req.file) {
      filename = `${process.env.ROOT_FOLDER_IMAGE_POST}/${req.file.filename}`;
    }

    const createPost = await post.create({
      userId: req.user.id,
      text: text,
      image: filename,
    });

    return res.json({
      message: "Success",
      data: createPost,
    });
  } catch (error) {
    console.log("error", error);
    await fs.unlink(
      path.join(
        `public/${process.env.ROOT_FOLDER_IMAGE_POST}/${req.file.filename}`
      )
    );
    return res.status(500).json({
      message: error?.errors || "Server Internal Error",
    });
  }
};
