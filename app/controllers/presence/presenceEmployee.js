const { presence_employee } = require("../../../models");
const { Op } = require("sequelize");
const convertToBoolean = require("../../helpers/convertToBoolean");
const { isValidateDate } = require("../../utils/constants/isValidateDate");
const {
  ROOT_FOLDER_IMAGE_PRESENCE,
} = require("../../utils/constants/urlBasePhoto");

const presenceEmployeeAdd = async (req, res) => {
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
    const create = await presence_employee.create(data);

    return res.json({
      message: "Success",
      data: create,
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
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset * limit),
      paranoid: false,
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

module.exports = {
  presenceEmployeeAdd,
  presenceEmployeeDelete,
  presenceEmployeeDetail,
  presenceEmployeeEdit,
  presenceEmployeePagination,
  presenceEmployeeAll,
  presenceEmployeeRestore,
};
