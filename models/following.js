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
      this.belongsTo(models.user);
    }
  }
  following.init(
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
      following_id: {
        type: DataTypes.UUIDV4,
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
