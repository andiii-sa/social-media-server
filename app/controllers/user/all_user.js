const { user } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const listUser = await user.findAll();

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
