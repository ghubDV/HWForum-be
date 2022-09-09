'use strict';

module.exports = {
  async up (queryInterface) {
    await  queryInterface.addIndex('Threads', ['topicID', 'profileID'], {
      name: 'threads_indexes'
    });
  },

  async down (queryInterface) {
    await queryInterface.removeIndex('Threads', 'threads_indexes');
  }
};
