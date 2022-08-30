'use strict';

module.exports = {
  async up (queryInterface) {
    await queryInterface.addConstraint('Threads', {
      fields: ['topicID'],
      type: 'foreign key',
      name: 'fk-topic',
      references: {
        table: 'Topics',
        field: 'id'
      }
    })

    await queryInterface.addConstraint('Threads', {
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
    await queryInterface.removeConstraint('Threads', 'fk-topic');
    await queryInterface.removeConstraint('Threads', 'fk-profile');
  }
};
