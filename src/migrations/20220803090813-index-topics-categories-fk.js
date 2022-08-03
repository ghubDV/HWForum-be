'use strict';

module.exports = {
  async up (queryInterface) {
    await  queryInterface.addIndex('Topics', ['categoryID'], {
      name: 'topics_categoryID'
    });
  },

  async down (queryInterface) {
    await queryInterface.removeIndex('Topics', 'topics_categoryID');
  }
};
