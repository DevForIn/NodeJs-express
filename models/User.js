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
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    birthday: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    kakao_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    naver_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    google_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    provider_type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    height: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    weight: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    bmi: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    medical_history: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    access_token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    refresh_token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    last_login: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'oh_users', // 테이블 이름을 oh_users로 설정
    timestamps: false, // Sequelize의 기본 createdAt 및 updatedAt 사용 안 함
});

// 테이블 동기화 (없으면 생성)
User.sync();

module.exports = User;