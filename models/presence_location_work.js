"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class presence_location_work extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.presence_schedule_employee, {
        foreignKey: "locationWorkId",
        as: "location",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  presence_location_work.init(
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
      clockIn: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      clockOut: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      isRequiredLocation: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      isRequiredPhoto: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "presence_location_work",
      timestamps: true,
      freezeTableName: true,
      paranoid: true,
    }
  );

  return presence_location_work;
};
