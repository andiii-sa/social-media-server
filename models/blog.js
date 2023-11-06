"use strict";
const { Model } = require("sequelize");
const user = require("./user");
const blog_category = require("./blog_category");
module.exports = (sequelize, DataTypes) => {
  class blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.blog_category, {
        targetKey: "id",
        foreignKey: "blogCategoryId",
      });
      this.belongsTo(models.user, {
        targetKey: "id",
        as: "author",
        foreignKey: "authorId",
      });
    }
  }
  blog.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      authorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: user,
          key: "id",
        },
      },
      blogCategoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: blog_category,
          key: "id",
        },
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "blog",
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    }
  );

  return blog;
};
