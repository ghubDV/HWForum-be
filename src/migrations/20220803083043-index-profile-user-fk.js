'use strict';

module.exports = {
  async up (queryInterface) {
    await  queryInterface.addIndex('Profiles', ['userID'], {
      name: 'profiles_userID',
      unique: true
    })
  },

  async down (queryInterface) {
    await queryInterface.removeIndex('Profiles', 'profiles_userID');
  }
};
