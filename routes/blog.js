const express = require("express");
const router = express.Router();
const blogController = require("../app/controllers/blog");
const verifyToken = require("../app/middleware/verify_token");
const permission = require("../app/middleware/permission");
const { uploadBlogSingle } = require("../app/middleware/multer");

router.post(
  "/blog/data",
  uploadBlogSingle,
  // verifyToken,
  // permission("admin"),
  blogController.postCreate
);

module.exports = router;
