const { chat_member, chat } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const { idUser } = req.params;

    // Search isSender in chat member
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
                userId: idUser,
              },
            },
          ],
        },
      ],
    });

    let idChat;
    if (!findChatId?.chatId) {
      const createChat = await chat.create({});
      const createChatMemberSender = await chat_member.create({
        chatId: createChat.id,
        userId: req.user.id,
      });
      const createChatMemberReceiver = await chat_member.create({
        chatId: createChat.id,
        userId: idUser,
      });
      idChat = createChat?.id;
    } else {
      idChat = findChatId?.chatId;
    }

    return res.json({
      message: "Success",
      data: {
        chatId: idChat,
      },
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: error?.errors || "Server Internal Error",
    });
  }
};
