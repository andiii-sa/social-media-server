const express = require("express");
const router = express.Router();
const authController = require("../app/controllers/auth");

router.post("/login", authController.login);
router.post("/register", authController.register);
router.put("/:id/edit", authController.updateAuth);

module.exports = router;
