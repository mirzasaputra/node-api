'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RoleHasPermissions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      roleId: {
        allowNull: false,
        type: Sequelize.UUID,
        primaryKey: true,
        onDelete: 'CASCADE',
        references: {
          model: 'Roles',
          key: 'id'
        }
      },
      permissionId: {
        allowNull: false,
        type: Sequelize.UUID,
        primaryKey: true,
        onDelete: 'CASCADE',
        references: {
          model: 'Permissions',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('RoleHasPermissions');
  }
};