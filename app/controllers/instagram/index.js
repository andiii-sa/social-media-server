const message = require("./message");
const listChat = require("./listChat");
const findIdChat = require("./findIdChat");
const userSearch = require("./userSearch");
const userProfile = require("./userProfile");
const listMessage = require("./listMessage");
const follow = require("./userFollow");
const unfollow = require("./userUnfollow");
const postCreate = require("./postCreate");
const dashboardPost = require("./dashboardPost");
const userSuggest = require("./userSuggest");
const postDetail = require("./postDetail");
const postAddComment = require("./postAddComment");
const postAddLike = require("./postAddLike");

module.exports = {
  message,
  listChat,
  findIdChat,
  userSearch,
  userProfile,
  listMessage,
  follow,
  unfollow,
  postCreate,
  dashboardPost,
  userSuggest,
  postDetail,
  postAddComment,
  postAddLike,
};
