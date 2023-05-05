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
        foreignKey: "chatId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      this.hasMany(models.chat_message, {
        foreignKey: "chatId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  chat.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      isGroup: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
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
