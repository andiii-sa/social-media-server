const express = require("express");
const router = express.Router();
const userController = require("../app/controllers/user");
const verifyToken = require("../app/middleware/verify_token");
const permission = require("../app/middleware/permission");

router.get(
  "/pagination",
  verifyToken,
  permission("admin"),
  userController.usersPagination
);
router.get("/all", verifyToken, permission("admin"), userController.usersAll);
router.delete(
  "/:id/delete",
  verifyToken,
  permission("admin"),
  userController.usersDelete
);

module.exports = router;
