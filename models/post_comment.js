"use strict";
const { Model } = require("sequelize");
const post = require("./post");
const user = require("./user");
module.exports = (sequelize, DataTypes) => {
  class post_comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.post);
      this.belongsTo(models.user);
    }
  }
  post_comment.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.UUIDV4,
      },
      user_id: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        references: {
          model: user,
          key: "id",
        },
      },
      post_id: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        references: {
          model: post,
          key: "id",
        },
      },
      tweet: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "post_comment",
      timestamps: true,
    }
  );

  return post_comment;
};
