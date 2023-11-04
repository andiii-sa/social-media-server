const { post } = require("../../../models");
const {
  ROOT_FOLDER_IMAGE_POST,
} = require("../../utils/constants/urlBasePhoto");

module.exports = async (req, res) => {
  try {
    const { text } = req.body;
    let filename;
    if (req.file) {
      filename = `${ROOT_FOLDER_IMAGE_POST}/${req.file.filename}`;
    }

    const createPost = await post.create({
      userId: req.user.id,
      text: text,
      image: filename,
    });

    return res.json({
      message: "Success",
      data: createPost,
      meta: {
        status: 200,
      },
    });
  } catch (error) {
    console.log("error", error);
    await fs.unlink(
      path.join(`public/${ROOT_FOLDER_IMAGE_POST}/${req.file.filename}`)
    );
    return res.status(500).json({
      message: error?.errors || "Server Internal Error",
      meta: {
        status: 500,
      },
    });
  }
};
