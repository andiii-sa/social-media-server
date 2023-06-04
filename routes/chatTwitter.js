const express = require("express");
const router = express.Router();
const chatTwitterController = require("../app/controllers/chat_twitter");
const verifyToken = require("../app/middleware/verify_token");
const permission = require("../app/middleware/permission");

router.get(
  "/list",
  verifyToken,
  permission("admin"),
  chatTwitterController.listChat
);
router.post(
  "/message",
  verifyToken,
  permission("admin"),
  chatTwitterController.message
);
router.get(
  "/message-list/:chatId",
  verifyToken,
  permission("admin"),
  chatTwitterController.listMessage
);
router.get(
  "/findidchat/:idUser",
  verifyToken,
  permission("admin"),
  chatTwitterController.findIdChat
);
router.get(
  "/user-search",
  verifyToken,
  permission("admin"),
  chatTwitterController.userSearch
);
router.get(
  "/user-profile/:username",
  verifyToken,
  permission("admin"),
  chatTwitterController.userProfile
);

module.exports = router;
