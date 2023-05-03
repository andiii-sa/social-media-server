"use strict";
const { Model } = require("sequelize");
// const chat_member = require("./chat_member");
// const chat_message = require("./chat_message");
module.exports = (sequelize, DataTypes) => {
  class chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.chat_member, {
        foreignKey: "chat_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      this.hasMany(models.chat_message, {
        foreignKey: "chat_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  chat.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.UUIDV4,
      },
      is_group: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "chat",
      timestamps: true,
    }
  );

  return chat;
};
