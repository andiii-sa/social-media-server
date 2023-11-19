const {
  presence_employee,
  presence_list_day,
  Sequelize,
  presence_schedule_employee,
  presence_location_work,
  user,
} = require("../../../models");
const { Op } = require("sequelize");
const convertToBoolean = require("../../helpers/convertToBoolean");
const { isValidateDate } = require("../../utils/constants/isValidateDate");
const {
  ROOT_FOLDER_IMAGE_PRESENCE,
} = require("../../utils/constants/urlBasePhoto");
const excelJS = require("exceljs");
const dayjs = require("dayjs");

const presenceEmployeeAdd = async (req, res) => {
  try {
    const { type, date } = req.params;
    const { id } = req.user;

    if (!["clock-in", "clock-out"].includes(type)) {
      return res.status(404).json({
        message: "Type invalid",
        meta: {
          status: 404,
        },
      });
    }
    if (!isValidateDate(date)) {
      return res.status(400).json({
        message: "Format date must YYYY-MM-DD",
        meta: {
          status: 404,
        },
      });
    }

    const isTypeClockIn = type === "clock-in" ? true : false;

    const {
      employeeId,
      dayId,
      dayName,
      clockIn,
      clockOut,
      image,
      longitude,
      latitude,
    } = req.body;

    let filename;
    if (req.file) {
      filename = `${ROOT_FOLDER_IMAGE_PRESENCE}/${req.file.filename}`;
    }

    const findD = await presence_list_day.findOne({
      where: {
        id: dayId,
      },
      paranoid: false,
    });

    if (!findD) {
      return res.status(404).json({
        message: "Day tidak ditemukan",
        meta: {
          status: 404,
        },
      });
    }

    let data = {
      employeeId,
      dayId,
      dayName: findD?.name,
      // clockIn,
      // clockOut,
      // longitude,
      // latitude,
    };

    let dataUpdate;

    if (isTypeClockIn) {
      data = {
        ...data,
        clockIn: clockIn,
      };
    } else {
      data = {
        ...data,
        clockOut: clockOut,
      };
    }

    const find = await presence_employee.findOne({
      where: {
        [Op.and]: [
          {
            employeeId: id,
          },
          Sequelize.where(
            Sequelize.fn("date", Sequelize.col("presence_employee.createdAt")),
            "=",
            new Date(date)
          ),
        ],
      },
      paranoid: false,
    });

    if (find) {
      let imageTemp = JSON.parse(find?.image);
      let longitudeTemp = JSON.parse(find?.longitude);
      let latitudeTemp = JSON.parse(find?.latitude);

      if (isTypeClockIn) {
        data = {
          ...data,
          longitude: JSON.stringify({
            ...longitudeTemp,
            clockIn: longitude ?? "",
          }),
          latitude: JSON.stringify({
            ...latitudeTemp,
            clockIn: latitude ?? "",
          }),
          image: JSON.stringify({
            ...imageTemp,
            clockIn: filename ?? "",
          }),
        };
      } else {
        data = {
          ...data,
          longitude: JSON.stringify({
            ...longitudeTemp,
            clockOut: longitude ?? "",
          }),
          latitude: JSON.stringify({
            ...latitudeTemp,
            clockOut: latitude ?? "",
          }),
          image: JSON.stringify({
            ...imageTemp,
            clockOut: filename ?? "",
          }),
        };
      }

      // update table
      dataUpdate = await presence_employee.update(data, {
        where: {
          id: find?.id,
        },
      });
    } else {
      if (isTypeClockIn) {
        data = {
          ...data,
          longitude: JSON.stringify({
            clockIn: longitude ?? "",
          }),
          latitude: JSON.stringify({
            clockIn: latitude ?? "",
          }),
          image: JSON.stringify({
            clockIn: filename ?? "",
          }),
        };
      } else {
        data = {
          ...data,
          longitude: JSON.stringify({
            clockOut: longitude ?? "",
          }),
          latitude: JSON.stringify({
            clockOut: latitude ?? "",
          }),
          image: JSON.stringify({
            clockOut: filename ?? "",
          }),
        };
      }
      // Insert
      dataUpdate = await presence_employee.create(data);
    }

    return res.json({
      message: "Success Presence",
      data: dataUpdate,
      meta: {
        status: 200,
      },
    });
  } catch (error) {
    console.log("error", error);
    if (req?.file?.filename) {
      fs.unlink(
        path.join(`public/${ROOT_FOLDER_IMAGE_PRESENCE}/${req.file.filename}`)
      );
    }
    return res.status(500).json({
      message: error?.errors || "Server Internal Error",
      meta: {
        status: 500,
      },
    });
  }
};

const presenceEmployeeEdit = async (req, res) => {
  try {
    const {
      employeeId,
      dayId,
      dayName,
      clockIn,
      clockOut,
      image,
      longitude,
      latitude,
    } = req.body;
    const { id } = req.params;

    let filename;
    if (req.file) {
      filename = `${ROOT_FOLDER_IMAGE_PRESENCE}/${req.file.filename}`;
    }
    let data = {
      employeeId,
      dayId,
      dayName,
      clockIn,
      clockOut,
      longitude,
      latitude,
    };
    if (filename) {
      data = {
        ...data,
        image: filename,
      };
    }

    const update = await presence_employee.update(data, {
      where: {
        id: id,
      },
    });

    return res.json({
      message: "Success",
      data: update,
      meta: {
        status: 200,
      },
    });
  } catch (error) {
    console.log("error", error);
    if (req?.file?.filename) {
      fs.unlink(
        path.join(`public/${ROOT_FOLDER_IMAGE_PRESENCE}/${req.file.filename}`)
      );
    }
    return res.status(500).json({
      message: error?.errors || "Server Internal Error",
      meta: {
        status: 500,
      },
    });
  }
};

const presenceEmployeeDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const find = await presence_employee.findOne({
      where: {
        id: id,
      },
      paranoid: false,
    });

    if (!find) {
      return res.status(404).json({
        message: "Presence Employee tidak ditemukan",
        meta: {
          status: 404,
        },
      });
    }

    return res.json({
      message: "Success",
      data: find,
      meta: {
        status: 200,
      },
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: error?.errors || "Server Internal Error",
      meta: {
        status: 500,
      },
    });
  }
};

const presenceEmployeeDelete = async (req, res) => {
  try {
    const { isDeleted = false } = req.query;
    const { id } = req.params;

    const find = await presence_employee.findOne({
      where: {
        id: id,
      },
      paranoid: false,
    });

    if (!find) {
      return res.status(404).json({
        message: "Presence Employee tidak ditemukan",
        meta: {
          status: 404,
        },
      });
    }

    await presence_employee.destroy({
      where: {
        id: id,
      },
      force: convertToBoolean(isDeleted),
    });

    return res.json({
      message: "Success",
      meta: {
        status: 200,
      },
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: error?.errors || "Server Internal Error",
      meta: {
        status: 500,
      },
    });
  }
};

const presenceEmployeeRestore = async (req, res) => {
  try {
    const { id } = req.params;

    const find = await presence_employee.findOne({
      where: {
        id: id,
      },
      paranoid: false,
    });

    if (!find) {
      return res.status(404).json({
        message: "Presence Employee tidak ditemukan",
        meta: {
          status: 404,
        },
      });
    }

    await presence_employee.restore({
      where: {
        id: id,
      },
    });

    return res.json({
      message: "Success",
      meta: {
        status: 200,
      },
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: error?.errors || "Server Internal Error",
      meta: {
        status: 500,
      },
    });
  }
};

const presenceEmployeePagination = async (req, res) => {
  try {
    const {
      limit = 5,
      offset = 0,
      employeeId,
      dayId,
      start_date,
      end_date,
    } = req.query;

    let filter = [];
    if (employeeId) {
      filter = [
        ...filter,
        {
          employeeId: {
            [Op.eq]: employeeId,
          },
        },
      ];
    }
    if (dayId) {
      filter = [
        ...filter,
        {
          dayId: {
            [Op.eq]: dayId,
          },
        },
      ];
    }
    if (start_date || end_date) {
      if (!isValidateDate(start_date) || !isValidateDate(end_date)) {
        return res.status(400).json({
          message: "Format date must YYYY-MM-DD",
          meta: {
            status: 404,
          },
        });
      } else {
        filter = [
          ...filter,
          {
            createdAt: {
              [Op.between]: [start_date, end_date],
            },
          },
        ];
      }
    }

    const find = await presence_employee.findAll({
      where:
        filter?.length > 0
          ? {
              [Op.or]: filter,
            }
          : {},
      include: [
        {
          model: user,
          attributes: ["id", "name"],
          as: "employee",
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset * limit),
      paranoid: false,
    });

    // count
    const countData = await presence_employee.count({
      where:
        filter?.length > 0
          ? {
              [Op.or]: filter,
            }
          : {},
    });

    const parseFind = JSON.parse(JSON.stringify(find));
    const listData = parseFind?.map((item) => ({
      ...item,
      image: item?.image && JSON.parse(item?.image ?? ""),
      longitude: item?.longitude && JSON.parse(item?.longitude ?? ""),
      latitude: item?.latitude && JSON.parse(item?.latitude ?? ""),
    }));

    return res.json({
      message: "Success",
      data: listData,
      meta: {
        status: 200,
        limit: limit,
        total: countData,
      },
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: error?.errors || "Server Internal Error",
      meta: {
        status: 500,
      },
    });
  }
};

const presenceEmployeeAll = async (req, res) => {
  try {
    const { employeeId, dayId, start_date, end_date } = req.query;

    let filter = [];
    if (employeeId) {
      filter = [
        ...filter,
        {
          employeeId: {
            [Op.eq]: employeeId,
          },
        },
      ];
    }
    if (dayId) {
      filter = [
        ...filter,
        {
          dayId: {
            [Op.eq]: dayId,
          },
        },
      ];
    }
    if (start_date || end_date) {
      if (!isValidateDate(start_date) || !isValidateDate(end_date)) {
        return res.status(400).json({
          message: "Format date mus YYYY-MM-DD tidak ditemukan",
          meta: {
            status: 404,
          },
        });
      } else {
        filter = [
          ...filter,
          {
            createdAt: {
              [Op.between]: [start_date, end_date],
            },
          },
        ];
      }
    }

    const find = await presence_employee.findAll({
      where: {
        [Op.or]: filter,
      },
    });

    // count
    const countData = await presence_employee.count({
      where: {
        [Op.or]: filter,
      },
    });

    return res.json({
      message: "Success",
      data: find,
      meta: {
        status: 200,
        total: countData,
      },
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: error?.errors || "Server Internal Error",
      meta: {
        status: 500,
      },
    });
  }
};

const presenceEmployeeScheduleNow = async (req, res) => {
  try {
    const { id } = req.user;
    const { dayName } = req.params;

    const findD = await presence_list_day.findOne({
      where: Sequelize.where(
        Sequelize.fn("lower", Sequelize.col("name")),
        Sequelize.fn("lower", dayName)
      ),
      paranoid: false,
    });

    if (!findD) {
      return res.status(404).json({
        message: "Day tidak ditemukan",
        meta: {
          status: 404,
        },
      });
    }
    const find = await presence_schedule_employee.findOne({
      attributes: ["id", "dayId", "employeeId"],
      where: {
        employeeId: id,
        dayId: findD?.id,
      },
      include: [
        {
          model: presence_list_day,
          attributes: ["id", "name"],
          as: "day",
          required: false,
        },
        {
          model: presence_location_work,
          attributes: [
            "id",
            "name",
            "clockIn",
            "clockOut",
            "isRequiredLocation",
            "isRequiredPhoto",
          ],
          as: "location",
          required: false,
        },
      ],
      paranoid: false,
    });

    if (!find) {
      return res.status(404).json({
        message: "Schedule tidak ditemukan",
        meta: {
          status: 404,
        },
      });
    }

    return res.json({
      message: "Success",
      data: find,
      meta: {
        status: 200,
      },
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: error?.errors || "Server Internal Error",
      meta: {
        status: 500,
      },
    });
  }
};

const presenceEmployeeDetailByUser = async (req, res) => {
  try {
    const { date } = req.params;
    const { id } = req.user;

    if (!isValidateDate(date)) {
      return res.status(400).json({
        message: "Format date must YYYY-MM-DD",
        meta: {
          status: 404,
        },
      });
    }

    const find = await presence_employee.findOne({
      // attributes: {
      //   // exclude: ["createdAt", "updatedAt", "deletedAt"],
      // },
      attributes: [
        "id",
        "employeeId",
        "dayId",
        "dayName",
        "clockIn",
        "clockOut",
        "image",
        "longitude",
        "latitude",
        "createdAt",
      ],
      where: {
        [Op.and]: [
          {
            employeeId: id,
          },
          Sequelize.where(
            Sequelize.fn("date", Sequelize.col("presence_employee.createdAt")),
            "=",
            new Date(date)
          ),
        ],
      },
      include: [
        {
          model: user,
          attributes: ["id", "name"],
          as: "employee",
          required: false,
        },
      ],
      paranoid: false,
    });
    const parseFind = JSON.parse(JSON.stringify(find));

    const data = {
      ...parseFind,
      id: parseFind?.id,
      employeeId: parseFind?.employeeId,
      employee: parseFind?.employee,
      dayId: parseFind?.dayId,
      dayName: parseFind?.dayName,
      clockIn: parseFind?.clockIn,
      clockOut: parseFind?.clockOut,
      image: parseFind?.image,
      longitude: parseFind?.longitude,
      latitude: parseFind?.latitude,
      image: parseFind?.image && JSON.parse(parseFind?.image ?? ""),
      longitude: parseFind?.longitude && JSON.parse(parseFind?.longitude ?? ""),
      latitude: parseFind?.latitude && JSON.parse(parseFind?.latitude ?? ""),
      isPresenceIn: parseFind?.clockIn ? true : false,
      isPresenceOut: parseFind?.clockOut ? true : false,
    };

    return res.json({
      message: "Success",
      data: data,
      meta: {
        status: 200,
      },
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: error?.errors || "Server Internal Error",
      meta: {
        status: 500,
      },
    });
  }
};

const presenceEmployeeExportExcel = async (req, res) => {
  let filename = "presence-" + dayjs().format("DD/MM/YYYY-HH:mm:ss") + ".xlsx";

  const workbook = new excelJS.Workbook();
  const worksheet = workbook.addWorksheet("Presence");

  worksheet.columns = [
    { header: "Name", key: "name" },
    { header: "Tanggal", key: "date" },
    { header: "Jam Masuk", key: "clockIn" },
    { header: "Jam Keluar", key: "clockOut" },
  ];

  try {
    const { employeeId, dayId, start_date, end_date } = req.query;

    let filter = [];
    if (employeeId) {
      filter = [
        ...filter,
        {
          employeeId: {
            [Op.eq]: employeeId,
          },
        },
      ];
    }
    if (dayId) {
      filter = [
        ...filter,
        {
          dayId: {
            [Op.eq]: dayId,
          },
        },
      ];
    }
    if (start_date || end_date) {
      if (!isValidateDate(start_date) || !isValidateDate(end_date)) {
        return res.status(400).json({
          message: "Format date must YYYY-MM-DD",
          meta: {
            status: 404,
          },
        });
      } else {
        filter = [
          ...filter,
          {
            createdAt: {
              [Op.between]: [start_date, end_date],
            },
          },
        ];
      }
    }

    const find = await presence_employee.findAll({
      where:
        filter?.length > 0
          ? {
              [Op.or]: filter,
            }
          : {},
      include: [
        {
          model: user,
          attributes: ["id", "name"],
          as: "employee",
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
      paranoid: false,
    });

    const parseFind = JSON.parse(JSON.stringify(find));
    parseFind?.forEach((item) => {
      worksheet.addRow({
        name: item?.employee?.name,
        date: dayjs(item?.createdAt).format("DD/MM/YYYY"),
        clockIn: item?.clockIn,
        clockOut: item?.clockOut,
      });
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Filename", filename);

    return workbook.xlsx
      .write(res)
      .then(function () {
        res.status(200).end();
      })
      .catch((error) => {
        res.status(500).json({
          message: error?.errors || "Server Internal Error",
          meta: {
            status: 500,
          },
        });
      });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: error?.errors || "Server Internal Error",
      meta: {
        status: 500,
      },
    });
  }
};

module.exports = {
  presenceEmployeeAdd,
  presenceEmployeeDelete,
  presenceEmployeeDetail,
  presenceEmployeeEdit,
  presenceEmployeePagination,
  presenceEmployeeAll,
  presenceEmployeeRestore,
  presenceEmployeeScheduleNow,
  presenceEmployeeDetailByUser,
  presenceEmployeeExportExcel,
};
