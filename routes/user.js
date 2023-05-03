const express = require("express");
const router = express.Router();
const userController = require("../app/controllers/user");
const verifyToken = require("../app/middleware/verify_token");
const permission = require("../app/middleware/permission");

router.get("/all", verifyToken, permission("admin"), userController.all_user);

module.exports = router;
