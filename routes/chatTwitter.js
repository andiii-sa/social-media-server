const express = require("express");
const router = express.Router();
const chatTwitterController = require("../app/controllers/chat_twitter");
const verifyToken = require("../app/middleware/verify_token");
const permission = require("../app/middleware/permission");
const { uploadPostSingle } = require("../app/middleware/multer");

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

router.post(
  "/follow/:id",
  verifyToken,
  permission("admin"),
  chatTwitterController.follow
);
router.post(
  "/unfollow/:id",
  verifyToken,
  permission("admin"),
  chatTwitterController.unfollow
);
router.post(
  "/post",
  uploadPostSingle,
  verifyToken,
  permission("admin"),
  chatTwitterController.postCreate
);
router.get(
  "/dashboard/post",
  verifyToken,
  permission("admin"),
  chatTwitterController.dashboardPost
);
router.get(
  "/dashboard/user-suggest",
  verifyToken,
  permission("admin"),
  chatTwitterController.userSuggest
);
module.exports = router;
