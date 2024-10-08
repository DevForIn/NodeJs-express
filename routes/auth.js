const express = require('express');
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const router = express.Router();
const bcrypt = require('bcryptjs');

// 미들웨어 가져오기
const { authenticateRefreshToken }  = require('../middleware/authenticateToken');

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
    const { username, password, fcm_token } = req.body; // 요청 본문 get
    try {
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // JWT 액세스 토큰 생성(유효 기간 1시간)
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // JWT 리프레시 토큰 생성 (유효 기간 7일)
        const refreshToken = jwt.sign({ id : user.id, username: user.username}, process.env.JWT_SECRET_REFRESH, { expiresIn : '7d'});

        console.log('Updating user tokens in DB'); // 업데이트 로그

        // 사용자 FCM 엑세스 토큰 업데이트 및 리프레시 토큰 업데이트
        await user.update({
            fcm_token: token,
            refresh_token: refreshToken
        });


        // 헤더에 토큰 생성
        res.header('Authorization', `Bearer ${token}`).send({ message: 'Logged in successfully', token, refreshToken }); // token도 응답에 포함
    } catch (error) {
        res.status(400).json({ error: 'Login failed' });
        console.log(error.message);
    }
});

// 리프레시 토큰을 사용해 새로운 액세스 토큰 발급
router.post('/token', authenticateRefreshToken, (req, res) => {

    const user = req.user;

    // 새로운 액세스 토큰 발급
    const newAccessToken = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token: newAccessToken });
});

module.exports = router;