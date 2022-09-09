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
      fields: ['profileID'],
      type: 'foreign key',
      name: 'fk-profile',
      references: {
        table: 'Profiles',
        field: 'id'
      }
    })
  },

  async down (queryInterface) {
    await queryInterface.removeConstraint('Comments', 'fk-thread');
    await queryInterface.removeConstraint('Comments', 'fk-profile');
  }
};
