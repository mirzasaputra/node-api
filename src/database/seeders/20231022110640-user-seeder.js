'use strict';

const { hash, genSalt } = require('bcrypt');
const { v4 } = require('uuid');
const { User } = require('../../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const developer = await User.create({
      id: v4(),
      userableType: null,
      userableId: null,
      name: 'Developer',
      email: 'root@gmail.com',
      username: 'root',
      password: await hash('root', await genSalt()),
      emailVerifiedAt: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    await developer.assignRole('Developer')
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    return queryInterface.bulkDelete('Users', null, {})
  }
};
