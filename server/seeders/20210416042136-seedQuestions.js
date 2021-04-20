'use strict';
const questions = require('../data/question.json');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   questions.forEach(el => {
     el.createdAt = new Date()
     el.updatedAt = new Date()
   })
   await queryInterface.bulkInsert('Questions', questions, {})
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Questions',null, {})
  }
};
