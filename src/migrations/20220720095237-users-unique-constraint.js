'use strict';

module.exports = {
  async up (queryInterface) {
    await queryInterface.addConstraint('Users', {
      fields: ['username', 'email'],
      type: 'unique',
      name: 'unique_constraints'
    });
  },

  async down (queryInterface) {
     await queryInterface.removeConstraint('Users', 'unique_constraints');
  }
};