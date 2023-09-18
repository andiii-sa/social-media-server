const { user, post_comment } = require("../../../models");

module.exports = (io) => {
  // Socket.io
  let ioSocket = io.of("/message-post-comment");
  ioSocket.on("connection", (socket) => {
    const roomPostId = socket.handshake.query?.postId;
    console.log("roomPostId", roomPostId);
    socket.join(`room:${roomPostId}`);

    socket.on("sendMessageCommentPost", async ({ userId, postId, text }) => {
      let createChatMessage;
      let detailCommentMessage;

      try {
        createChatMessage = await post_comment.create({
          userId: userId,
          postId: postId,
          text: text,
        });
        detailCommentMessage = await post_comment.findOne({
          where: {
            id: createChatMessage.id,
          },
          include: [
            {
              model: user,
              attributes: {
                exclude: [
                  "password",
                  "is_verification",
                  "otp",
                  "date_verification",
                  "role",
                ],
              },
            },
          ],
        });
      } catch (error) {
        console.log("error trycatch", error);
      }

      const payloadMessage = {
        createdAt: detailCommentMessage?.createdAt,
        id: detailCommentMessage?.id,
        image: detailCommentMessage?.image,
        text: detailCommentMessage?.text,
        updatedAt: detailCommentMessage?.updatedAt,
        user: detailCommentMessage?.user,
        userId: detailCommentMessage?.userId,
        isFailed: false,
      };

      if (detailCommentMessage) {
        ioSocket
          .in(`room:${postId}`)
          .emit("getMessageCommentPost", payloadMessage);
      } else {
        ioSocket.to(socket.id).emit("getMessageCommentPost", {
          ...payloadMessage,
          isFailed: true,
        });
      }
    });
  });
};
