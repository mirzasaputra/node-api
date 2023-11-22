'use strict';

const { v4 } = require('uuid');
const { Role } = require('../../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const developer = await Role.create({
      id: v4(),
      name: 'Developer',
      guardName: 'Web'
    })
    await developer.syncPermission([
      'read-dashboard',
      'read-roles', 'craete-roles', 'update-roles', 'delete-roles', 'change-roles',
      'read-users', 'craete-users', 'update-users', 'delete-users',
    ])
  },

  async down (queryInterface, Sequelize) {
    queryInterface.bulkDelete('Roles', null, {})
  }
};
