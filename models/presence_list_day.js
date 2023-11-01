"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class presence_list_day extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.presence_employee, {
        foreignKey: "dayId",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      });

      this.hasMany(models.presence_schedule_employee, {
        foreignKey: "dayId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  presence_list_day.init(
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
    },
    {
      sequelize,
      modelName: "presence_list_day",
      timestamps: true,
      paranoid: true,
    }
  );

  return presence_list_day;
};
