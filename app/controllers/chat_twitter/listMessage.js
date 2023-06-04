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
    const { chatId } = req.params;

    const listMessage = await chat_message.findAll({
      where: {
        chatId: chatId,
      },
      order: [["createdAt", "ASC"]],
    });

    return res.json({
      message: "Success",
      data: listMessage,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: error?.errors || "Server Internal Error",
    });
  }
};
