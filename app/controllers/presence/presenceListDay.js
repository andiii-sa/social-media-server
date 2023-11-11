const { presence_list_day } = require("../../../models");
const { Op } = require("sequelize");
const convertToBoolean = require("../../helpers/convertToBoolean");

const presenceListDayAdd = async (req, res) => {
  try {
    const { name } = req.body;

    const create = await presence_list_day.create({
      name: name,
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

const presenceListDayEdit = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    let data = {
      name: name,
    };

    const update = await presence_list_day.update(data, {
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

const presenceListDayDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const find = await presence_list_day.findOne({
      where: {
        id: id,
      },
      paranoid: false,
    });

    if (!find) {
      return res.status(404).json({
        message: "List Day tidak ditemukan",
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

const presenceListDayDelete = async (req, res) => {
  try {
    const { isDeleted = false } = req.query;
    const { id } = req.params;

    const find = await presence_list_day.findOne({
      where: {
        id: id,
      },
      paranoid: false,
    });

    if (!find) {
      return res.status(404).json({
        message: "List Day tidak ditemukan",
        meta: {
          status: 404,
        },
      });
    }

    await presence_list_day.destroy({
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

const presenceListDayRestore = async (req, res) => {
  try {
    const { id } = req.params;

    const find = await presence_list_day.findOne({
      where: {
        id: id,
      },
      paranoid: false,
    });

    if (!find) {
      return res.status(404).json({
        message: "List Day tidak ditemukan",
        meta: {
          status: 404,
        },
      });
    }

    await presence_list_day.restore({
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

const presenceListDayPagination = async (req, res) => {
  try {
    const { keywords = "", limit = 5, offset = 0 } = req.query;

    const find = await presence_list_day.findAll({
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
    const countData = await presence_list_day.count({
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

const presenceListDayAll = async (req, res) => {
  try {
    const { keywords = "" } = req.query;

    const find = await presence_list_day.findAll({
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
    const countData = await presence_list_day.count({
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
  presenceListDayAdd,
  presenceListDayDelete,
  presenceListDayDetail,
  presenceListDayEdit,
  presenceListDayPagination,
  presenceListDayAll,
  presenceListDayRestore,
};
