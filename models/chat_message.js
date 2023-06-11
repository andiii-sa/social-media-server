"use strict";
const { Model } = require("sequelize");
const user = require("./user");
const chat = require("./chat");
module.exports = (sequelize, DataTypes) => {
  class chat_message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.chat, {
        targetKey: "id",
        foreignKey: "chatId",
      });
      this.belongsTo(models.user, {
        targetKey: "id",
        foreignKey: "userId",
      });
    }
  }
  chat_message.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      chatId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: chat,
          key: "id",
        },
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: user,
          key: "id",
        },
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      video: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "chat_message",
      timestamps: true,
    }
  );

  return chat_message;
};
