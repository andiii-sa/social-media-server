"use strict";
const { Model } = require("sequelize");
const user = require("./user");
// const post_share = require("./post_share");
// const post_like = require("./post_like");
// const post_comment = require("./post_comment");
module.exports = (sequelize, DataTypes) => {
  class post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.user);

      this.hasMany(models.post_share, {
        foreignKey: "post_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      this.hasMany(models.post_like, {
        foreignKey: "post_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      this.hasMany(models.post_comment, {
        foreignKey: "post_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  post.init(
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
      modelName: "post",
      timestamps: true,
    }
  );

  return post;
};
