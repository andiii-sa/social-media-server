"use strict";
const { Model } = require("sequelize");
const user = require("./user");
module.exports = (sequelize, DataTypes) => {
  class follower extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.user, {
        as: "followers",
        targetKey: "id",
        foreignKey: "userId",
      });
      this.belongsTo(models.user, {
        as: "userFollowers",
        targetKey: "id",
        foreignKey: "followerId",
      });
    }
  }
  follower.init(
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
      followerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: user,
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "follower",
      timestamps: true,
    }
  );

  return follower;
};
