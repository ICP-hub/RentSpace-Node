const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: '5432',
  username: 'postgres',
  password: '141009',
  database: 'test',
  logging: false, // Set to true to log queries
});

module.exports = sequelize;