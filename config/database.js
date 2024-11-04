const { Sequelize } = require('sequelize');

// 데이터베이스 설정
const dbName = 'postgres';
const dbUser = 'postgres';
const dbPassword = 'j2in';
const dbHost = '127.0.0.1';

// Sequelize 인스턴스 생성
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    dialect: 'postgres',
});

module.exports = sequelize;