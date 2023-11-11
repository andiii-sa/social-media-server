"use strict";
const { Model } = require("sequelize");
const user = require("./user");
const presence_list_day = require("./presence_list_day");
const presence_location_work = require("./presence_location_work");
module.exports = (sequelize, DataTypes) => {
  class presence_schedule_employee extends Model {
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
      this.belongsTo(models.presence_location_work, {
        targetKey: "id",
        foreignKey: "locationWorkId",
      });
    }
  }
  presence_schedule_employee.init(
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
      locationWorkId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: presence_location_work,
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "presence_schedule_employee",
      timestamps: true,
      freezeTableName: true,
      paranoid: true,
    }
  );

  return presence_schedule_employee;
};
