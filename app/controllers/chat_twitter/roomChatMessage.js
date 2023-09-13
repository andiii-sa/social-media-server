const { Op } = require("sequelize");
const { user, chat_message, chat, chat_member } = require("../../../models");

module.exports = (io) => {
  // Socket.io
  let users = [];
  io.of("/message-chat").on("connection", (socket) => {
    console.log("User connected", socket.id);
    socket.on("addUser", (data) => {
      const isUserExist = users.find(
        (user) => user.userId === data?.userId && user?.socketId === socket.id
      );
      if (isUserExist) {
        const user = {
          userId: data?.userId,
          chatId: data?.chatId,
          socketId: socket.id,
        };
        const findIndex = users.findIndex(
          (user) => user.userId === data?.userId && user?.socketId === socket.id
        );
        users[findIndex] = user;
        io.of("/message-chat").emit("getUsers", users);
      }
      if (!isUserExist) {
        const user = {
          userId: data?.userId,
          chatId: data?.chatId,
          socketId: socket.id,
        };
        users.push(user);
        io.of("/message-chat").emit("getUsers", users);
      }
    });

    socket.on("sendMessage", async ({ senderId, receiverId, text, chatId }) => {
      const receiver = users.find((user) => user.userId === receiverId);
      const sender = users.find(
        (user) => user.userId === senderId && user?.chatId === chatId
      );

      let createChatMessage;
      let senderChatMessage;
      let receiverChatMessage;

      try {
        createChatMessage = await chat_message.create({
          chatId: chatId,
          userId: senderId,
          text: text,
        });
        senderChatMessage = await chat_member.findOne({
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          where: {
            userId: senderId,
            chatId: chatId,
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
                      [Op.not]: senderId,
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

        receiverChatMessage = await chat_member.findOne({
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          where: {
            userId: receiverId,
            chatId: chatId,
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
                      [Op.not]: senderId,
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
      } catch (error) {}

      const payloadMessage = {
        userId: senderId,
        text,
        chatId,
        receiverId,
        createdAt: createChatMessage?.createdAt,
        id: createChatMessage?.id,
        image: createChatMessage?.image,
        updatedAt: createChatMessage?.updatedAt,
        video: createChatMessage?.video,
        isFailed: false,
      };

      const payloadSenderChatMessage = {
        chatId: senderChatMessage?.chatId,
        id: senderChatMessage?.id,
        user: senderChatMessage?.chat?.chat_members?.[0]?.user,
        messages: senderChatMessage?.chat?.chat_messages?.[0],
      };

      const payloadReceiverChatMessage = {
        chatId: receiverChatMessage?.chatId,
        id: receiverChatMessage?.id,
        user: receiverChatMessage?.chat?.chat_members?.[0]?.user,
        messages: receiverChatMessage?.chat?.chat_messages?.[0],
      };

      console.log("sender :>> ", sender, receiver);
      if (createChatMessage) {
        if (receiver) {
          io.of("/message-chat")
            .to(receiver.socketId)
            .to(sender.socketId)
            .emit("getMessage", payloadMessage);

          io.of("/message-chat")
            .to(sender.socketId)
            .emit("getChatList", payloadSenderChatMessage);
          io.of("/message-chat")
            .to(receiver.socketId)
            .emit("getChatList", payloadReceiverChatMessage);
        } else {
          io.of("/message-chat")
            .to(sender.socketId)
            .emit("getMessage", payloadMessage);
          io.of("/message-chat")
            .to(sender.socketId)
            .emit("getChatList", payloadSenderChatMessage);
        }
      } else {
        io.of("/message-chat")
          .to(sender.socketId)
          .emit("getMessage", {
            ...payloadMessage,
            isFailed: true,
          });
      }
    });

    socket.on("disconnect", () => {
      users = users.filter((user) => user.socketId !== socket.id);
      io.emit("getUsers", users);
    });
  });
};
