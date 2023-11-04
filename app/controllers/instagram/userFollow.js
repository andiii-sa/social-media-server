const { following, follower } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    // check user is follow
    const isFollowing = await following.findOne({
      where: {
        userId: req?.user?.id,
        followingId: id,
      },
    });

    if (isFollowing) {
      return res.json({
        message: "Kamu sudah mengikuti",
        meta: {
          status: 200,
        },
      });
    }

    const createFollowing = following.create({
      userId: req?.user?.id,
      followingId: id,
    });
    const createFollower = follower.create({
      userId: id,
      followerId: req?.user?.id,
    });

    return res.json({
      message: "Success",
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
