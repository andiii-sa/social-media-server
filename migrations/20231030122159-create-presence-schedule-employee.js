"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("presence_schedule_employee", {
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
        allowNull: false,
      },
      locationWorkId: {
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
      deletedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addConstraint("presence_schedule_employee", {
      type: "foreign key",
      name: "PRESENCE_SCHEDULE_EMPLOYEE_USER_ID",
      fields: ["employeeId"],
      references: {
        table: "users",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("presence_schedule_employee", {
      type: "foreign key",
      name: "PRESENCE_SCHEDULE_EMPLOYEE_DAY_ID",
      fields: ["dayId"],
      references: {
        table: "presence_list_day",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("presence_schedule_employee", {
      type: "foreign key",
      name: "PRESENCE_SCHEDULE_EMPLOYEE_LOCATION_WORK_ID",
      fields: ["locationWorkId"],
      references: {
        table: "presence_location_work",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("presence_schedule_employee");
    await queryInterface.removeConstraint(
      "presence_schedule_employee",
      "PRESENCE_SCHEDULE_EMPLOYEE_USER_ID"
    );
    await queryInterface.removeConstraint(
      "presence_schedule_employee",
      "PRESENCE_SCHEDULE_EMPLOYEE_DAY_ID"
    );
    await queryInterface.removeConstraint(
      "presence_schedule_employee",
      "PRESENCE_SCHEDULE_EMPLOYEE_LOCATION_WORK_ID"
    );
  },
};
