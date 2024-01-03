const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize({
//   dialect: 'postgres',
//   host: 'localhost',
//   port: '5432',
//   username: 'postgres',
//   password: 'root',
//   database: 'postgres',
//   logging: false, // Set to true to log queries
// });
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: '5432',
  username: 'postgres',
  password: 'ProdWalleTServer@1234#KOLPl',
  database: 'rentspace',
  logging: false, // Set to true to log queries
});

module.exports = sequelize;