'use strict';

const { v4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const permissions = [
      // Dasboard related permission
      { name: 'read-dashboard', displayName: 'Read Dashboard'},

      // Roles related permission
      { name: 'read-roles', displayName: 'Read Roles'},
      { name: 'create-roles', displayName: 'Create Roles'},
      { name: 'update-roles', displayName: 'Update Roles'},
      { name: 'delete-roles', displayName: 'Delete Roles'},
      { name: 'change-roles', displayName: 'Change Permissions'},

      // Users related permission
      { name: 'read-users', displayName: 'Read Users'},
      { name: 'create-users', displayName: 'Create Users'},
      { name: 'update-users', displayName: 'Update Users'},
      { name: 'delete-users', displayName: 'Delete Users'},
    ]
    return queryInterface.bulkInsert('Permissions', permissions.map(value => ({
      id: v4(),
      name: value.name,
      displayName: value.displayName,
      guardName: 'Web',
      createdAt: new Date(),
      updatedAt: new Date()
    })))
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Permissions', null, {})
  }
};
