const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('assignment7', 'root', '', {
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql'
});

sequelize.authenticate()
    .then(() => console.log('Database connected successfully.'))
    .catch(err => console.error('Unable to connect to the database:', err));

module.exports = sequelize;
