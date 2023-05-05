"use strict";
const { Model } = require("sequelize");
const user = require("./user");
const post = require("./post");
module.exports = (sequelize, DataTypes) => {
  class post_like extends Model {
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
  post_like.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: user,
          key: "id",
        },
      },
      post_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: post,
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "post_like",
      timestamps: true,
    }
  );

  return post_like;
};
