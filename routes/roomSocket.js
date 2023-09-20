const roomChatMessage = require("../app/controllers/instagram/roomChatMessage");
const roomPostCommentMessage = require("../app/controllers/instagram/roomPostCommentMessage");

module.exports = (io) => {
  roomChatMessage(io);
  roomPostCommentMessage(io);
};
