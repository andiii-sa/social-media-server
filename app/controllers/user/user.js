const { user } = require("../../../models");

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

module.exports = {
  usersPagination,
  usersAll,
};
