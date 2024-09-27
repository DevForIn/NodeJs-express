const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 사용자 스키마 정의
const userSchema = new mongoose.Schema({
    username: { type:String, required: true, unique: true},
    password: { type:String, required: true},
});

// 비밀번호를 저장하기 전에 암호화
userSchema.pre('save',async function (next) {
    if( !this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// 비밀번호 비교 메서드
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User',userSchema);

module.exports = User;