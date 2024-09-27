const express = require('express');
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const router = express.Router();
const bcrypt = require('bcryptjs');

// 회원가입
router.post('/register', async (req,res) => {
    const { username, password } = req.body;
    try{

        // 비밀번호 해싱
        const hashePassword = await bcrypt.hash(password,10);

        //유저 생성
        const newUser = await User.create({ username, password : hashePassword});
        res.status(201).json({message: 'User registered successfully'});
    } catch (error) {
        // 사용자 이름 중복 체크
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Username already exists' });
        }
        res.status(400).json({ error: 'Registration failed' });
        console.log(error.message);
    }
});

// 로그인 라우트
router.post('/login', async (req, res) => {
    const { username, password, fcm_token } = req.body; // fcm_token을 요청 본문에서 가져오기
    try {
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // JWT 토큰 생성
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // 사용자 FCM 토큰 업데이트
        if (fcm_token) {
            await user.update({ fcm_token });
        }

        // 헤더에 토큰 생성
        res.header('Authorization', `Bearer ${token}`).send({ message: 'Logged in successfully', token }); // token도 응답에 포함
    } catch (error) {
        res.status(400).json({ error: 'Login failed' });
        console.log(error.message);
    }
});

module.exports = router;