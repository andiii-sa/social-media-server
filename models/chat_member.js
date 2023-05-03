"use strict";
const { Model } = require("sequelize");
const chat = require("./chat");
const user = require("./user");
module.exports = (sequelize, DataTypes) => {
  class chat_member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.chat);
      this.belongsTo(models.user);
    }
  }
  chat_member.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.UUIDV4,
      },
      chat_id: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        references: {
          model: chat,
          key: "id",
        },
      },
      user_id: {
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
      modelName: "chat_member",
      timestamps: true,
    }
  );

  return chat_member;
};
