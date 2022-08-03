'use strict';

const topics = 
[
  {
    categoryID: 1,
    name: 'CPUs',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    categoryID: 1,
    name: 'Graphics cards',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    categoryID: 1,
    name: 'Motherboards',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    categoryID: 1,
    name: 'Memory',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    categoryID: 1,
    name: 'Storage',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    categoryID: 1,
    name: 'Power Supplies',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    categoryID: 1,
    name: 'Cooling',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    categoryID: 1,
    name: 'Cases',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert('Topics', topics)
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('Topics', null);
  }
};
