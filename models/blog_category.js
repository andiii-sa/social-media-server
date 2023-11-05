"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class blog_category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.blog, {
        foreignKey: "blogCategoryId",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      });
    }
  }
  blog_category.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "blog_category",
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    }
  );

  return blog_category;
};
