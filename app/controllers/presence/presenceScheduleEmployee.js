const { presence_schedule_employee } = require("../../../models");
const { Op } = require("sequelize");
const convertToBoolean = require("../../helpers/convertToBoolean");
const presence_list_day = require("../../../models/presence_list_day");
const presence_location_work = require("../../../models/presence_location_work");
const user = require("../../../models/user");

const presenceScheduleEmployeeAddSingle = async (req, res) => {
  try {
    const { employeeId, dayId, locationWorkId } = req.body;

    const findLD = await presence_list_day.findOne({
      where: {
        id: dayId,
      },
      paranoid: false,
    });

    if (!findLD) {
      return res.status(404).json({
        message: "Day tidak ditemukan",
        meta: {
          status: 404,
        },
      });
    }
    const findLW = await presence_location_work.findOne({
      where: {
        id: dayId,
      },
      paranoid: false,
    });

    if (!findLW) {
      return res.status(404).json({
        message: "Location Work tidak ditemukan",
        meta: {
          status: 404,
        },
      });
    }

    const create = await presence_schedule_employee.create({
      employeeId: employeeId,
      dayId: dayId,
      locationWorkId: locationWorkId,
    });

    return res.json({
      message: "Success",
      data: create,
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

const presenceScheduleEmployeeAddMultiple = async (req, res) => {
  try {
    const { employeeId, dayId, locationWorkId } = req.body;

    const findLW = await presence_location_work.findOne({
      where: {
        id: dayId,
      },
      paranoid: false,
    });

    if (!findLW) {
      return res.status(404).json({
        message: "Location Work tidak ditemukan",
        meta: {
          status: 404,
        },
      });
    }

    const data = dayId?.map((day) => ({
      employeeId: employeeId,
      dayId: day,
      locationWorkId: locationWorkId,
    }));

    const create = await presence_schedule_employee.bulkCreate(data);

    return res.json({
      message: "Success",
      data: create,
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

const presenceScheduleEmployeeEdit = async (req, res) => {
  try {
    const { dayId, locationWorkId } = req.body;
    const { id } = req.params;

    let data = {
      dayId: dayId,
      locationWorkId: locationWorkId,
    };

    const update = await presence_schedule_employee.update(data, {
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
    return res.status(500).json({
      message: error?.errors || "Server Internal Error",
      meta: {
        status: 500,
      },
    });
  }
};

const presenceScheduleEmployeeDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const find = await presence_schedule_employee.findOne({
      where: {
        id: id,
      },
      paranoid: false,
    });

    if (!find) {
      return res.status(404).json({
        message: "Schedule Employee tidak ditemukan",
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

const presenceScheduleEmployeeDelete = async (req, res) => {
  try {
    const { isDeleted = false } = req.query;
    const { id } = req.params;

    const find = await presence_schedule_employee.findOne({
      where: {
        id: id,
      },
      paranoid: false,
    });

    if (!find) {
      return res.status(404).json({
        message: "Schedule Employee tidak ditemukan",
        meta: {
          status: 404,
        },
      });
    }

    await presence_schedule_employee.destroy({
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

const presenceScheduleEmployeeRestore = async (req, res) => {
  try {
    const { id } = req.params;

    const find = await presence_schedule_employee.findOne({
      where: {
        id: id,
      },
      paranoid: false,
    });

    if (!find) {
      return res.status(404).json({
        message: "Schedule Employee tidak ditemukan",
        meta: {
          status: 404,
        },
      });
    }

    await presence_schedule_employee.restore({
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

const presenceScheduleEmployeePagination = async (req, res) => {
  try {
    const { keywords = "", limit = 5, offset = 0 } = req.query;

    const find = await user.findAll({
      attributes: ["id", "name", "username"],
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${keywords}%`,
            },
          },
        ],
      },
      include: [
        {
          model: presence_schedule_employee,
          attributes: ["id", "dayId"],
          required: false,
          include: [
            {
              model: presence_list_day,
              attributes: ["id", "name"],
              required: false,
            },
          ],
        },
      ],
      order: [["name", "ASC"]],
      limit: parseInt(limit),
      offset: parseInt(offset * limit),
      paranoid: true,
    });

    // count
    const countData = await presence_schedule_employee.count({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${keywords}%`,
            },
          },
        ],
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

// const presenceScheduleEmployeeAll = async (req, res) => {
//   try {
//     const { keywords = "" } = req.query;

//     const find = await presence_schedule_employee.findAll({
//       where: {
//         [Op.or]: [
//           {
//             name: {
//               [Op.like]: `%${keywords}%`,
//             },
//           },
//         ],
//       },
//     });

//     // count
//     const countData = await presence_schedule_employee.count({
//       where: {
//         [Op.or]: [
//           {
//             name: {
//               [Op.like]: `%${keywords}%`,
//             },
//           },
//         ],
//       },
//     });

//     return res.json({
//       message: "Success",
//       data: find,
//       meta: {
//         status: 200,
//         total: countData,
//       },
//     });
//   } catch (error) {
//     console.log("error", error);
//     return res.status(500).json({
//       message: error?.errors || "Server Internal Error",
//       meta: {
//         status: 500,
//       },
//     });
//   }
// };

module.exports = {
  presenceScheduleEmployeeAddSingle,
  presenceScheduleEmployeeAddMultiple,
  presenceScheduleEmployeeDelete,
  presenceScheduleEmployeeDetail,
  presenceScheduleEmployeeEdit,
  presenceScheduleEmployeePagination,
  // presenceScheduleEmployeeAll,
  presenceScheduleEmployeeRestore,
};
