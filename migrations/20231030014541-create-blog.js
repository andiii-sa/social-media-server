"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("blog", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      blogCategoryId: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      authorId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      title: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      image: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      body: {
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
      deletedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addConstraint("blog", {
      type: "foreign key",
      name: "BLOG_BLOG_CATEGORY_ID",
      fields: ["blogCategoryId"],
      references: {
        table: "blog_category",
        field: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
    await queryInterface.addConstraint("blog", {
      type: "foreign key",
      name: "BLOG_USERS_ID",
      fields: ["authorId"],
      references: {
        table: "users",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("blog");
    await queryInterface.removeConstraint("blog", "BLOG_BLOG_CATEGORY_ID");
    await queryInterface.removeConstraint("blog", "BLOG_USERS_ID");
  },
};
