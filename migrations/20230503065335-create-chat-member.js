"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("chat_members", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      chat_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addConstraint("chat_members", {
      type: "foreign key",
      name: "CHATMEMBERS_USER_ID",
      fields: ["user_id"],
      references: {
        table: "users",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.addConstraint("chat_members", {
      type: "foreign key",
      name: "CHATMEMBERS_CHAT_ID",
      fields: ["chat_id"],
      references: {
        table: "chats",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("chat_members");
    await queryInterface.removeConstraint(
      "chat_members",
      "CHATMEMBERS_USER_ID"
    );
    await queryInterface.removeConstraint(
      "chat_members",
      "CHATMEMBERS_CHAT_ID"
    );
  },
};
