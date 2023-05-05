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

module.exports = router;
