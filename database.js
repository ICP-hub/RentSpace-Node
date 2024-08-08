const { Sequelize } = require('sequelize');

// Local Database rajnish
// const sequelize = new Sequelize({
//   dialect: 'postgres',
//   host: 'localhost',
//   port: '5432',
//   username: 'postgres',
//   password: '1234',
//   database: 'task',
//   logging: false, // Set to true to log queries
// });

// Local Database atharva
// const sequelize = new Sequelize({
//   dialect: 'postgres',
//   host: 'localhost',
//   port: '5432',
//   username: 'postgres',
//   password: 'pg123',
//   database: 'postgres',
//   logging: false, // Set to true to log queries
// });

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: '5432',
  username: 'postgres',
  password: "Rentspace2331Z&hh",
  database: 'postgres'
});

module.exports = sequelize;