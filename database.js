const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize({
//   dialect: 'postgres',
//   host: '172.17.0.2',
//   port: '5432',
//   username: 'aamir',
//   password: 'my1sec@pass',
//   database: 'task',
//   logging: false, // Set to true to log queries
// });

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: '5432',
  username: 'postgres',
  password: "DDateoiyys2331Z&hh",
  database: 'rentspace'
});

module.exports = sequelize;