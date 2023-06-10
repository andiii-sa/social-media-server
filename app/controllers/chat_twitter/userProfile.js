const { Op } = require("sequelize");
const {
  user,
  post,
  follower,
  following,
  chat_member,
  chat,
} = require("../../../models");

module.exports = async (req, res) => {
  try {
    const { username } = req.params;

    const userDetail = await user.findOne({
      attributes: {
        exclude: [
          "password",
          "is_verification",
          "otp",
          "date_verification",
          "role",
        ],
      },
      where: {
        username: username,
      },
      include: [
        {
          model: post,
        },
        {
          model: follower,
          as: "followers",
          required: false,
          include: [
            {
              model: user,
              as: "userFollowers",
              attributes: ["id", "name", "username"],
            },
          ],
        },
        {
          model: following,
          as: "followings",
          required: false,
          include: [
            {
              model: user,
              as: "userFollowing",
              attributes: ["id", "name", "username"],
            },
          ],
        },
      ],
    });

    const findChatId = await chat_member.findOne({
      where: {
        userId: req.user.id,
      },
      include: [
        {
          model: chat,
          include: [
            {
              model: chat_member,
              where: {
                userId: userDetail?.id,
              },
            },
          ],
        },
      ],
    });

    if (!userDetail) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    let userProfile;
    userProfile = {
      id: userDetail?.id,
      username: userDetail?.username,
      email: userDetail?.email,
      name: userDetail?.name,
      photo: userDetail?.photo,
      createdAt: userDetail?.createdAt,
      updatedAt: userDetail?.updatedAt,
      posts: userDetail?.posts,
      followers: userDetail?.followers,
      followings: userDetail?.followings,
      isMe: req?.user?.id === userDetail?.id ? true : false,
      isFollow: userDetail?.followers?.some(
        (f) => f?.followerId === req?.user?.id
      ),
      countFollower: userDetail?.followers?.length ?? 0,
      countFollowing: userDetail?.followings?.length ?? 0,
      chatId: findChatId?.chatId ?? null,
    };

    return res.json({
      message: "Success",
      data: userProfile,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: error?.errors || "Server Internal Error",
    });
  }
};
