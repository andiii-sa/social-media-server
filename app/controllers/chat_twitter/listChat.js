const {
  user,
  chat_member,
  chat_message,
  sequelize,
  chat,
} = require("../../../models");

module.exports = async (req, res) => {
  try {
    // ambil semua data di chat member, dimana userId
    const listChatMessage = await chat_member.findAll({
      where: {
        userId: req.user.id,
      },
      include: [
        {
          model: user,
          attributes: ["id", "name", "email"],
        },
        {
          model: chat,
          attributes: ["id"],
          include: [
            {
              model: chat_message,
              attributes: ["id", "text"],
              include: [
                {
                  model: user,
                  attributes: ["id", "name"],
                },
              ],
            },
          ],
        },
      ],
    });

    return res.json({
      message: "Success",
      data: listChatMessage,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: error?.errors || "Server Internal Error",
    });
  }
};
