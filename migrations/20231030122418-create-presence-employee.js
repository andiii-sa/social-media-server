"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("presence_employee", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      employeeId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      dayId: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      dayName: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      clockIn: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      clockOut: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      image: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      longitude: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      latitude: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addConstraint("presence_employee", {
      type: "foreign key",
      name: "PRESENCE_EMPLOYEE_USER_ID",
      fields: ["employeeId"],
      references: {
        table: "users",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("presence_employee", {
      type: "foreign key",
      name: "PRESENCE_EMPLOYEE_DAY_ID",
      fields: ["dayId"],
      references: {
        table: "presence_list_day",
        field: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("presence_employee");
    await queryInterface.removeConstraint(
      "presence_employee",
      "PRESENCE_EMPLOYEE_USER_ID"
    );
    await queryInterface.removeConstraint(
      "presence_employee",
      "PRESENCE_EMPLOYEE_DAY_ID"
    );
  },
};
