const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Sequelize 인스턴스 가져오기

class User extends Model {
    // 비밀번호 비교 메서드 추가
    async comparePassword(password) {
        // 비밀번호 비교 로직 (예: bcrypt를 사용하여 해시된 비밀번호와 비교)
        const bcrypt = require('bcryptjs');
        return await bcrypt.compare(password, this.password);
    }
}

User.init({
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // 사용자 이름의 고유성 보장
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fcm_token: {
        type: DataTypes.TEXT,
        allowNull: true, // 유저가 로그인할 때 저장되므로 초기엔 null일 수 있음
    },
    refresh_token: {
        type: DataTypes.TEXT,
        allowNull: true, // 유저가 로그인할 때 저장되므로 초기엔 null일 수 있음
    },
}, {
    sequelize,
    modelName: 'user',
});

// 테이블 동기화 (없으면 생성)
User.sync();

module.exports = User;