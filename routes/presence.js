const express = require("express");
const router = express.Router();
const presenceController = require("../app/controllers/presence");
const verifyToken = require("../app/middleware/verify_token");
const permission = require("../app/middleware/permission");
const { uploadPresenceEmployee } = require("../app/middleware/multer");

// Location Work
router.post(
  "/location-work/add",
  verifyToken,
  permission("admin"),
  presenceController.presenceLocationWorkAdd
);
router.put(
  "/location-work/:id/edit",
  verifyToken,
  permission("admin"),
  presenceController.presenceLocationWorkEdit
);
router.delete(
  "/location-work/:id/delete",
  verifyToken,
  permission("admin"),
  presenceController.presenceLocationWorkDelete
);
router.put(
  "/location-work/:id/restore",
  verifyToken,
  permission("admin"),
  presenceController.presenceLocationWorkRestore
);
router.get(
  "/location-work/pagination",
  verifyToken,
  permission("admin"),
  presenceController.presenceLocationWorkPagination
);
router.get(
  "/location-work/all",
  verifyToken,
  permission("admin"),
  presenceController.presenceLocationWorkAll
);
router.get(
  "/location-work/:id/detail",
  verifyToken,
  permission("admin"),
  presenceController.presenceLocationWorkDetail
);

// Presence Employee
router.post(
  "/employee/:type/:date/add",
  verifyToken,
  uploadPresenceEmployee,
  permission("admin"),
  presenceController.presenceEmployeeAdd
);
router.put(
  "/employee/:id/edit",
  verifyToken,
  permission("admin"),
  presenceController.presenceEmployeeEdit
);
router.delete(
  "/employee/:id/delete",
  verifyToken,
  permission("admin"),
  presenceController.presenceEmployeeDelete
);
router.put(
  "/employee/:id/restore",
  verifyToken,
  permission("admin"),
  presenceController.presenceEmployeeRestore
);
router.get(
  "/employee/pagination",
  verifyToken,
  permission("admin"),
  presenceController.presenceEmployeePagination
);
router.get(
  "/employee/all",
  verifyToken,
  permission("admin"),
  presenceController.presenceEmployeeAll
);
router.get(
  "/employee/:id/detail",
  verifyToken,
  permission("admin"),
  presenceController.presenceEmployeeDetail
);
router.get(
  "/employee/:date/detail-now",
  verifyToken,
  permission("admin"),
  presenceController.presenceEmployeeDetailByUser
);
router.get(
  "/employee/:dayName/shcedule-now",
  verifyToken,
  permission("admin"),
  presenceController.presenceEmployeeScheduleNow
);
router.get(
  "/employee/export-excel",
  verifyToken,
  permission("admin"),
  presenceController.presenceEmployeeExportExcel
);

// List Day
router.post(
  "/list-day/add",
  verifyToken,
  permission("admin"),
  presenceController.presenceListDayAdd
);
router.put(
  "/list-day/:id/edit",
  verifyToken,
  permission("admin"),
  presenceController.presenceListDayEdit
);
router.delete(
  "/list-day/:id/delete",
  verifyToken,
  permission("admin"),
  presenceController.presenceListDayDelete
);
router.put(
  "/list-day/:id/restore",
  verifyToken,
  permission("admin"),
  presenceController.presenceListDayRestore
);
router.get(
  "/list-day/pagination",
  verifyToken,
  permission("admin"),
  presenceController.presenceListDayPagination
);
router.get(
  "/list-day/all",
  verifyToken,
  permission("admin"),
  presenceController.presenceListDayAll
);
router.get(
  "/list-day/:id/detail",
  verifyToken,
  permission("admin"),
  presenceController.presenceListDayDetail
);

// Schedule Employee
router.post(
  "/schedule-employee/add-single",
  verifyToken,
  permission("admin"),
  presenceController.presenceScheduleEmployeeAddSingle
);
router.post(
  "/schedule-employee/add-multiple",
  verifyToken,
  permission("admin"),
  presenceController.presenceScheduleEmployeeAddMultiple
);
router.put(
  "/schedule-employee/:id/edit",
  verifyToken,
  permission("admin"),
  presenceController.presenceScheduleEmployeeEdit
);
router.delete(
  "/schedule-employee/:id/delete",
  verifyToken,
  permission("admin"),
  presenceController.presenceScheduleEmployeeDelete
);
router.put(
  "/schedule-employee/:id/restore",
  verifyToken,
  permission("admin"),
  presenceController.presenceScheduleEmployeeRestore
);
router.get(
  "/schedule-employee/pagination",
  verifyToken,
  permission("admin"),
  presenceController.presenceScheduleEmployeePagination
);
// router.get(
//   "/schedule-employee/all",
//   verifyToken,
//   permission("admin"),
//   presenceController.presenceScheduleEmployee
// );
router.get(
  "/schedule-employee/:id/detail",
  verifyToken,
  permission("admin"),
  presenceController.presenceScheduleEmployeeDetail
);

module.exports = router;
