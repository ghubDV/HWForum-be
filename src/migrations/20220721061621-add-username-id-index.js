'use strict';

module.exports = {
  async up (queryInterface) {
    await queryInterface.addIndex('Users', ['id', 'username'], {
      name: 'username_id'
    })
  },

  async down (queryInterface) {
    await queryInterface.removeIndex('Users', 'username_id');
  }
};
