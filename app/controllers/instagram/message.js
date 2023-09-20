const { chat, chat_message } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const { chatId, text, image } = req.body;

    const validChatId = await chat.findOne({
      where: {
        id: chatId,
      },
    });

    // valid chat id
    if (!validChatId) {
      return res.status(404).json({
        message: "invalid id chat",
      });
    }

    const createChatMessage = await chat_message.create({
      chatId: chatId,
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
