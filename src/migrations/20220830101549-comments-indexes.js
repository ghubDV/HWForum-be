'use strict';

module.exports = {
  async up (queryInterface) {
    await  queryInterface.addIndex('Comments', ['threadID', 'profileID'], {
      name: 'comments_indexes'
    });
  },

  async down (queryInterface) {
    await queryInterface.removeIndex('Comments', 'comments_indexes');
  }
};
