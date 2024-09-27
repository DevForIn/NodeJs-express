const { Sequelize } = require('sequelize');

// Sequelize 인스턴스 생성
const sequelize = new Sequelize('postgres', 'postgres', 'admin', {
    host: '127.0.0.1',
    dialect: 'postgres',
});

module.exports = sequelize;
