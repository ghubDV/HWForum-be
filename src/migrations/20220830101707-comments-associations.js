'use strict';

module.exports = {
  async up (queryInterface) {
    await queryInterface.addConstraint('Comments', {
      fields: ['threadID'],
      type: 'foreign key',
      name: 'fk-thread',
      references: {
        table: 'Threads',
        field: 'id'
      }
    })

    await queryInterface.addConstraint('Comments', {
      fields: ['profileName'],
      type: 'foreign key',
      name: 'fk-profile',
      references: {
        table: 'Profiles',
        field: 'profileName'
      }
    })
  },

  async down (queryInterface) {
    await queryInterface.removeConstraint('Threads', 'fk-thread');
    await queryInterface.removeConstraint('Threads', 'fk-profile');
  }
};
