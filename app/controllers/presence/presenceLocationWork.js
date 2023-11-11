const { presence_location_work } = require("../../../models");
const { Op } = require("sequelize");
const convertToBoolean = require("../../helpers/convertToBoolean");

const presenceLocationWorkAdd = async (req, res) => {
  try {
    const { name, clockIn, clockOut, isRequiredLocation, isRequiredPhoto } =
      req.body;

    const create = await presence_location_work.create({
      name: name,
      clockIn: clockIn,
      clockOut: clockOut,
      isRequiredLocation: convertToBoolean(isRequiredLocation),
      isRequiredPhoto: convertToBoolean(isRequiredPhoto),
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

const presenceLocationWorkEdit = async (req, res) => {
  try {
    const { name, clockIn, clockOut, isRequiredLocation, isRequiredPhoto } =
      req.body;
    const { id } = req.params;

    let data = {
      name: name,
      clockIn: clockIn,
      clockOut: clockOut,
      isRequiredLocation: convertToBoolean(isRequiredLocation),
      isRequiredPhoto: convertToBoolean(isRequiredPhoto),
    };

    const update = await presence_location_work.update(data, {
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

const presenceLocationWorkDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const find = await presence_location_work.findOne({
      where: {
        id: id,
      },
      paranoid: false,
    });

    if (!find) {
      return res.status(404).json({
        message: "Location Work tidak ditemukan",
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

const presenceLocationWorkDelete = async (req, res) => {
  try {
    const { isDeleted = false } = req.query;
    const { id } = req.params;

    const find = await presence_location_work.findOne({
      where: {
        id: id,
      },
      paranoid: false,
    });

    if (!find) {
      return res.status(404).json({
        message: "Location Work tidak ditemukan",
        meta: {
          status: 404,
        },
      });
    }

    await presence_location_work.destroy({
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

const presenceLocationWorkRestore = async (req, res) => {
  try {
    const { id } = req.params;

    const find = await presence_location_work.findOne({
      where: {
        id: id,
      },
      paranoid: false,
    });

    if (!find) {
      return res.status(404).json({
        message: "Location Work tidak ditemukan",
        meta: {
          status: 404,
        },
      });
    }

    await presence_location_work.restore({
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

const presenceLocationWorkPagination = async (req, res) => {
  try {
    const { keywords = "", limit = 5, offset = 0 } = req.query;

    const find = await presence_location_work.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${keywords}%`,
            },
          },
        ],
      },
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset * limit),
      paranoid: false,
    });

    // count
    const countData = await presence_location_work.count({
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

const presenceLocationWorkAll = async (req, res) => {
  try {
    const { keywords = "" } = req.query;

    const find = await presence_location_work.findAll({
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

    // count
    const countData = await presence_location_work.count({
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
  presenceLocationWorkAdd,
  presenceLocationWorkDelete,
  presenceLocationWorkDetail,
  presenceLocationWorkEdit,
  presenceLocationWorkPagination,
  presenceLocationWorkAll,
  presenceLocationWorkRestore,
};
