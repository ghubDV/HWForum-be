'use strict';

module.exports = {
  async up (queryInterface) {
    await queryInterface.addConstraint('Topics', {
      fields: ['categoryID'],
      type: 'foreign key',
      name: 'topics-categories-association',
      references: {
        table: 'Categories',
        field: 'id'
      }
    });
  },

  async down (queryInterface) {
    await queryInterface.removeConstraint('Topics', 'topics-categories-association');
  }
};
