const express = require("express");
const router = express.Router();
const instagramController = require("../app/controllers/instagram");
const verifyToken = require("../app/middleware/verify_token");
const permission = require("../app/middleware/permission");
const { uploadPostSingle } = require("../app/middleware/multer");

router.get(
  "/list-chat",
  verifyToken,
  permission("admin"),
  instagramController.listChat
);
router.post(
  "/message",
  verifyToken,
  permission("admin"),
  instagramController.message
);
router.get(
  "/message-list/:chatId",
  verifyToken,
  permission("admin"),
  instagramController.listMessage
);
router.get(
  "/find-id-chat/:idUser",
  verifyToken,
  permission("admin"),
  instagramController.findIdChat
);
router.get(
  "/user-search",
  verifyToken,
  permission("admin"),
  instagramController.userSearch
);
router.get(
  "/user-profile/:username",
  verifyToken,
  permission("admin"),
  instagramController.userProfile
);

router.post(
  "/follow/:id",
  verifyToken,
  permission("admin"),
  instagramController.follow
);
router.post(
  "/unfollow/:id",
  verifyToken,
  permission("admin"),
  instagramController.unfollow
);
router.post(
  "/post",
  uploadPostSingle,
  verifyToken,
  permission("admin"),
  instagramController.postCreate
);
router.post(
  "/post/:id/add-comment",
  verifyToken,
  permission("admin"),
  instagramController.postAddComment
);
router.post(
  "/post/:id/add-like",
  verifyToken,
  permission("admin"),
  instagramController.postAddLike
);
router.get(
  "/post/:id",
  verifyToken,
  permission("admin"),
  instagramController.postDetail
);
router.get(
  "/dashboard/post",
  verifyToken,
  permission("admin"),
  instagramController.dashboardPost
);
router.get(
  "/dashboard/user-suggest",
  verifyToken,
  permission("admin"),
  instagramController.userSuggest
);
module.exports = router;
