'use strict';

module.exports = {
  async up (queryInterface) {
    await queryInterface.addConstraint('Profiles', {
      fields: ['userID'],
      type: 'foreign key',
      name: 'profile-user-association',
      references: {
        table: 'Users',
        field: 'id'
      }
    });
  },

  async down (queryInterface) {
    await queryInterface.removeConstraint('Profiles', 'profile-user-association');
  }
};
