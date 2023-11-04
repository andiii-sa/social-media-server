const { blog_category } = require("../../../models");

const blogCategoryAdd = async (req, res) => {
  try {
    const { name } = req.body;

    const createBlogCategory = await blog_category.create({
      name: name,
    });

    return res.json({
      message: "Success",
      data: createBlogCategory,
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

const blogCategoryEdit = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    let data = {
      name: name,
    };

    const updateBlogCategory = await blog_category.update(data, {
      where: {
        id: id,
      },
    });

    return res.json({
      message: "Success",
      data: updateBlogCategory,
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

const blogCategoryDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const findBlogCategory = await blog_category.findOne({
      where: {
        id: id,
      },
      paranoid: false,
    });

    if (!findBlogCategory) {
      return res.status(404).json({
        message: "Blog Category tidak ditemukan",
        meta: {
          status: 404,
        },
      });
    }

    return res.json({
      message: "Success",
      data: findBlogCategory,
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

const blogCategoryDelete = async (req, res) => {
  try {
    const { isDeleted = false } = req.query;
    const { id } = req.params;

    const findBlogCategory = await blog_category.findOne({
      where: {
        id: id,
      },
    });

    if (!findBlogCategory) {
      return res.status(404).json({
        message: "Blog Category tidak ditemukan",
        meta: {
          status: 404,
        },
      });
    }

    await blog_category.destroy({
      where: {
        id: id,
      },
      force: isDeleted,
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

const blogCategoryPagination = async (req, res) => {
  try {
    const { keywords = "", limit = 5, offset = 0 } = req.query;

    const findBlogCategory = await blog_category.findAll({
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
    const countData = await blog_category.count({
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
      data: findBlogCategory,
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

const blogCategoryAll = async (req, res) => {
  try {
    const { keywords = "" } = req.query;

    const findBlogCategory = await blog_category.findAll({
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
    const countData = await blog_category.count({
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
      data: findBlogCategory,
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
  blogCategoryAdd,
  blogCategoryDelete,
  blogCategoryDetail,
  blogCategoryEdit,
  blogCategoryPagination,
  blogCategoryAll,
};
