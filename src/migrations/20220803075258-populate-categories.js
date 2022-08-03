'use strict';

const categories = 
[
  {
    name: 'Hardware',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
]

module.exports = {
  async up (queryInterface) {
   await queryInterface.bulkInsert('Categories', categories);
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('Categories', null);
  }
};
