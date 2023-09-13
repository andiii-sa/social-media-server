const roomChatMessage = require("../app/controllers/chat_twitter/roomChatMessage");
const roomPostCommentMessage = require("../app/controllers/chat_twitter/roomPostCommentMessage");

module.exports = (io) => {
  roomChatMessage(io);
  roomPostCommentMessage(io);
};
