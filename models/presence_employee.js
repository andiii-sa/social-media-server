"use strict";
const { Model } = require("sequelize");
const user = require("./user");
const presence_list_day = require("./presence_list_day");
module.exports = (sequelize, DataTypes) => {
  class presence_employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.user, {
        targetKey: "id",
        foreignKey: "employeeId",
      });
      this.belongsTo(models.presence_list_day, {
        targetKey: "id",
        foreignKey: "dayId",
      });
    }
  }
  presence_employee.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      employeeId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: user,
          key: "id",
        },
      },
      dayId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: presence_list_day,
          key: "id",
        },
      },
      dayName: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      clockIn: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      clockOut: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      longitude: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      latitude: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "presence_employee",
      timestamps: true,
      paranoid: true,
    }
  );

  return presence_employee;
};
