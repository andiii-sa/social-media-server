const { Op } = require("sequelize");
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
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      where: {
        userId: req.user.id,
      },
      include: [
        {
          model: chat,
          attributes: ["id"],
          include: [
            {
              model: chat_message,
              attributes: ["id", "text", "userId", "createdAt"],
              separate: true,
              order: [["createdAt", "DESC"]],
              limit: 1,
              include: [
                {
                  model: user,
                  attributes: ["id", "name"],
                },
              ],
            },
            {
              model: chat_member,
              attributes: {
                exclude: ["createdAt", "updatedAt", "userId", "chatId"],
              },
              where: {
                userId: {
                  [Op.not]: req.user.id,
                },
              },
              include: [
                {
                  model: user,
                  attributes: ["id", "name", "photo", "username"],
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
