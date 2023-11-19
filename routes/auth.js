const express = require("express");
const router = express.Router();
const authController = require("../app/controllers/auth");
const { uploadFileMultipleUser } = require("../app/middleware/multer");

router.post("/login", authController.login);
router.post("/register", authController.register);
router.put("/:id/edit", authController.updateAuth);
router.get("/download-format-data", authController.authExportFormatDataExcel);
router.post(
  "/uppload-multiple-user",
  uploadFileMultipleUser,
  authController.authUploadMultipleUser
);

module.exports = router;
