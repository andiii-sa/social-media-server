const { Op } = require("sequelize");
const { user, chat_member, chat_message, chat } = require("../../../models");

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

    const refChatList = listChatMessage?.map((chat) => ({
      chatId: chat?.chatId,
      id: chat?.id,
      user: chat?.chat?.chat_members?.[0]?.user,
      messages: chat?.chat?.chat_messages?.[0],
    }));

    return res.json({
      message: "Success",
      data: refChatList,
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
