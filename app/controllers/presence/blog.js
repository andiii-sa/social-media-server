const { blog, blog_category, user } = require("../../../models");
const { Op } = require("sequelize");
const {
  ROOT_FOLDER_IMAGE_BLOG,
} = require("../../utils/constants/urlBasePhoto");
const fs = require("fs");

const blogAdd = async (req, res) => {
  try {
    const { blogCategoryId, title, body } = req.body;
    let filename;
    if (req.file) {
      filename = `${ROOT_FOLDER_IMAGE_BLOG}/${req.file.filename}`;
    }

    const createBlog = await blog.create({
      authorId: req.user.id,
      blogCategoryId: blogCategoryId,
      title: title,
      body: body,
      image: filename,
    });

    return res.json({
      message: "Success",
      data: createBlog,
      meta: {
        status: 200,
      },
    });
  } catch (error) {
    console.log("error", error);
    if (req?.file?.filename) {
      fs.unlink(
        path.join(`public/${ROOT_FOLDER_IMAGE_BLOG}/${req.file.filename}`)
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

const blogEdit = async (req, res) => {
  try {
    const { blogCategoryId, title, body } = req.body;
    const { id } = req.params;

    let filename;
    if (req.file) {
      filename = `${ROOT_FOLDER_IMAGE_BLOG}/${req.file.filename}`;
    }

    let data = {
      authorId: req.user.id,
      blogCategoryId: blogCategoryId,
      title: title,
      body: body,
    };

    data = {
      ...data,
      image: filename,
    };

    const updateBlog = await blog.update(data, {
      where: {
        id: id,
      },
    });

    return res.json({
      message: "Success",
      data: updateBlog,
      meta: {
        status: 200,
      },
    });
  } catch (error) {
    console.log("error", error);
    if (req?.file?.filename) {
      fs.unlink(
        path.join(`public/${ROOT_FOLDER_IMAGE_BLOG}/${req.file.filename}`)
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

const blogDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const findBlog = await blog.findOne({
      where: {
        id: id,
      },
      paranoid: false,
      include: [
        {
          model: user,
          attributes: ["id", "name", "photo"],
          as: "author",
          required: false,
        },
        {
          model: blog_category,
          attributes: ["id", "name"],
          required: false,
        },
      ],
    });

    if (!findBlog) {
      return res.status(404).json({
        message: "Blog tidak ditemukan",
        meta: {
          status: 404,
        },
      });
    }

    return res.json({
      message: "Success",
      data: findBlog,
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

const blogDelete = async (req, res) => {
  try {
    const { isDeleted = false } = req.query;
    const { id } = req.params;

    const findBlog = await blog.findOne({
      where: {
        id: id,
      },
    });

    if (!findBlog) {
      return res.status(404).json({
        message: "Blog tidak ditemukan",
        meta: {
          status: 404,
        },
      });
    }

    await blog.destroy({
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
        status: 404,
      },
    });
  }
};

const blogPagination = async (req, res) => {
  try {
    const {
      keywords = "",
      limit = 5,
      offset = 0,
      blogCategoryId = null,
    } = req.query;

    let filter = [];
    if (keywords) {
      filter = [
        ...filter,
        {
          title: {
            [Op.like]: `%${keywords}%`,
          },
        },
      ];
    }
    if (blogCategoryId) {
      filter = [
        ...filter,
        {
          blogCategoryId: {
            [Op.eq]: blogCategoryId,
          },
        },
      ];
    }

    const findBlog = await blog.findAll({
      where: {
        [Op.and]: filter,
      },
      include: [
        {
          model: user,
          attributes: ["id", "name"],
          as: "author",
          required: false,
        },
        {
          model: blog_category,
          attributes: ["id", "name"],
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset * limit),
    });

    // count
    const countData = await blog.count({
      where: {
        [Op.and]: filter,
      },
    });

    return res.json({
      message: "Success",
      data: findBlog,
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

module.exports = {
  blogAdd,
  blogDelete,
  blogDetail,
  blogEdit,
  blogPagination,
};
