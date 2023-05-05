"use strict";
const { Model } = require("sequelize");
const user = require("./user");
const post = require("./post");
module.exports = (sequelize, DataTypes) => {
  class post_share extends Model {
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
  post_share.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: user,
          key: "id",
        },
      },
      postId: {
        type: DataTypes.UUID,
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
      modelName: "post_share",
      timestamps: true,
    }
  );

  return post_share;
};
