"use strict";
const { Model, Deferrable } = require("sequelize");
const user = require("./user");
module.exports = (sequelize, DataTypes) => {
  class following extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.user, {
        as: "followings",
        targetKey: "id",
        foreignKey: "userId",
      });
      this.belongsTo(models.user, {
        as: "userFollowing",
        targetKey: "id",
        foreignKey: "followingId",
      });
    }
  }
  following.init(
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
      followingId: {
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
      modelName: "following",
      timestamps: true,
    }
  );

  return following;
};
