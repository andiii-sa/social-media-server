const { following, follower } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    const createFollowing = following.destroy({
      where: {
        userId: req?.user?.id,
        followingId: id,
      },
    });
    const createFollower = follower.destroy({
      where: {
        userId: id,
        followerId: req?.user?.id,
      },
    });

    return res.json({
      message: "Success",
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: error?.errors || "Server Internal Error",
    });
  }
};
