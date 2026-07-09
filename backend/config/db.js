const { Sequelize } = require('sequelize');

let sequelize;

const getSequelize = () => {
  if (!sequelize) {
    sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASS,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false,
        define: {
          timestamps: true,
          underscored: false,
        },
      }
    );
  }
  return sequelize;
};

const syncDB = async () => {
  try {
    const seq = getSequelize();
    await seq.authenticate();
    console.log(`MySQL Connected: ${process.env.DB_HOST}:${process.env.DB_PORT || 3306}`);

    const models = require('../models');
    void models.User;

    await seq.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Database tables synchronized.');
  } catch (error) {
    console.error(`MySQL Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { getSequelize, syncDB };
