const { user } = require("../../../models");
const { Op } = require("sequelize");

const usersPagination = async (req, res) => {
  try {
    const { keywords = "", limit = 5, offset = 0 } = req.query;

    const findUsers = await user.findAll({
      attributes: {
        exclude: [
          "password",
          "is_verification",
          "otp",
          "date_verification",
          "role",
        ],
      },
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
    });

    // count
    const countData = await user.count({
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
    });

    return res.json({
      message: "Success",
      data: findUsers,
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

const usersAll = async (req, res) => {
  try {
    const { keywords = "" } = req.query;

    const findUsers = await user.findAll({
      attributes: {
        exclude: [
          "password",
          "is_verification",
          "otp",
          "date_verification",
          "role",
        ],
      },
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
    const countData = await user.count({
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
      data: findUsers,
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

const usersDelete = async (req, res) => {
  try {
    const { isDeleted = false } = req.query;
    const { id } = req.params;

    const find = await user.findOne({
      where: {
        id: id,
      },
    });

    if (!find) {
      return res.status(404).json({
        message: "User tidak ditemukan",
        meta: {
          status: 404,
        },
      });
    }

    await user.destroy({
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

module.exports = {
  usersPagination,
  usersAll,
  usersDelete,
};
