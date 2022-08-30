'use strict';

module.exports = {
  async up (queryInterface) {
    await  queryInterface.addIndex('Comments', ['threadID', 'profileName'], {
      name: 'comments_indexes'
    });
  },

  async down (queryInterface) {
    await queryInterface.removeIndex('Comments', 'comments_indexes');
  }
};
