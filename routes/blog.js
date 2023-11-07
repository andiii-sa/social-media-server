const express = require("express");
const router = express.Router();
const blogController = require("../app/controllers/blog");
const verifyToken = require("../app/middleware/verify_token");
const permission = require("../app/middleware/permission");
const { uploadBlogSingle } = require("../app/middleware/multer");

// Blog
router.post(
  "/add",
  uploadBlogSingle,
  verifyToken,
  permission("admin"),
  blogController.blogAdd
);
router.put(
  "/:id/edit",
  uploadBlogSingle,
  verifyToken,
  permission("admin"),
  blogController.blogEdit
);
router.delete(
  "/:id/delete",
  verifyToken,
  permission("admin"),
  blogController.blogDelete
);
router.put(
  "/:id/restore",
  verifyToken,
  permission("admin"),
  blogController.blogRestore
);
router.get("/:id/detail", blogController.blogDetail);
router.get("/pagination", blogController.blogPaginationAdmin);
router.get("/website/pagination", blogController.blogPaginationUser);

// Blog Category
router.post(
  "/category/add",
  verifyToken,
  permission("admin"),
  blogController.blogCategoryAdd
);
router.put(
  "/category/:id/edit",
  verifyToken,
  permission("admin"),
  blogController.blogCategoryEdit
);
router.delete(
  "/category/:id/delete",
  verifyToken,
  permission("admin"),
  blogController.blogCategoryDelete
);
router.put(
  "/category/:id/restore",
  verifyToken,
  permission("admin"),
  blogController.blogCategoryRestore
);
router.get(
  "/category/pagination",
  verifyToken,
  permission("admin"),
  blogController.blogCategoryPagination
);
router.get(
  "/category/all",
  verifyToken,
  permission("admin"),
  blogController.blogCategoryAll
);

module.exports = router;
