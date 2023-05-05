const { chat, chat_member, chat_message } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const { chatId, receiverId, text, image, isGroup, title } = req.body;
    let realChatId = chatId;

    if (chatId) {
      const validChatId = await chat.findOne({
        where: {
          id: chatId,
        },
      });

      // Create Chat ID
      if (!validChatId) {
        const createChat = await chat.create({
          isGroup: isGroup,
          title: title,
        });
        const createChatMemberSender = await chat_member.create({
          chatId: createChat.id,
          userId: req.user.id,
        });
        const createChatMemberReceiver = await chat_member.create({
          chatId: createChat.id,
          userId: receiverId,
        });
        realChatId = createChat.id;
      }
    } else {
      const createChat = await chat.create({
        isGroup: isGroup,
        title: title,
      });
      const createChatMemberSender = await chat_member.create({
        chatId: createChat.id,
        userId: req.user.id,
      });
      const createChatMemberReceiver = await chat_member.create({
        chatId: createChat.id,
        userId: receiverId,
      });
      realChatId = createChat.id;
    }
    const createChatMessage = await chat_message.create({
      chatId: realChatId,
      userId: req.user.id,
      text: text,
      //   image:imageUrl
    });

    return res.json({
      message: "Success Message",
      data: createChatMessage,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: error?.errors || "Server Internal Error",
    });
  }
};
