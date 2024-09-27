const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Sequelize 인스턴스 가져오기

class Cat extends Model {}

Cat.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    bread: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'cat',
});

module.exports = Cat;