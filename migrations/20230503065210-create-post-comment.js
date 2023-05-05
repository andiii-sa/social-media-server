"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("post_comments", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      post_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      tweet: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      image: {
        type: Sequelize.TEXT,
        allowNull: true,
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

    await queryInterface.addConstraint("post_comments", {
      type: "foreign key",
      name: "POSTCOMMENTS_USER_ID",
      fields: ["user_id"],
      references: {
        table: "users",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.addConstraint("post_comments", {
      type: "foreign key",
      name: "POSTCOMMENTS_POST_ID",
      fields: ["post_id"],
      references: {
        table: "posts",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("post_comments");
    await queryInterface.removeConstraint(
      "post_comments",
      "POSTCOMMENTS_USER_ID"
    );
    await queryInterface.removeConstraint(
      "post_comments",
      "POSTCOMMENTS_POST_ID"
    );
  },
};
