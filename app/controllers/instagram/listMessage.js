const { chat_message, chat } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const { chatId } = req.params;

    const findChatId = await chat.findOne({
      where: {
        id: chatId,
      },
    });

    if (!findChatId) {
      return res.status(404).json({
        message: "Chat tidak ditemukan",
        meta: {
          status: 404,
        },
      });
    }

    const listMessage = await chat_message.findAll({
      where: {
        chatId: chatId,
      },
      order: [["createdAt", "ASC"]],
    });

    return res.json({
      message: "Success",
      data: listMessage,
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
