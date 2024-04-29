const { Sequelize } = require('sequelize');

// Local Database
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: '5432',
  username: 'postgres',
  password: 'pg123',
  database: 'postgres',
  logging: false, // Set to true to log queries
});

// const sequelize = new Sequelize({
//   dialect: 'postgres',
//   host: 'localhost',
//   port: '5432',
//   username: 'postgres',
//   password: "DDateoiyys2331Z&hh",
//   database: 'rentspace'
// });

module.exports = sequelize;