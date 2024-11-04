const express = require('express');
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const router = express.Router();
const bcrypt = require('bcryptjs');

// 미들웨어 가져오기
const { authenticateRefreshToken }  = require('../middleware/authenticateToken');
const { NOW } = require('sequelize');

// 회원가입
router.post('/register', async (req,res) => {
    const { id, name, phone, birthday, password } = req.body;
    try{

        // 비밀번호 해싱
        const hashePassword = await bcrypt.hash(password,10);

        //유저 생성
        const newUser = await User.create({ id, name , phone, birthday, password : hashePassword});
        res.status(201).json({message: 'User registered successfully'});
    } catch (error) {
        // 사용자 이름 중복 체크
        if (error.id === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'ID already exists' });
        }
        res.status(400).json({ error: 'Registration failed' });
        console.log(error.message);
    }
});

// ID 체크
router.post('/id-check', async (req,res) => {
    const { id } = req.body;
    try{
        const user = await User.findOne({ where: { id } });
        
        if (user) {
            return res.status(409).json({ message: 'ID already exists' });
        } 
        else return res.status(202).json({ message: 'Available ID' });

    } catch (error) {
        res.status(400).json({ error: 'ID Check failed' });
        console.log(error.message); 
    }
});

// test
router.post('/test', async (req,res) => {
    console.log("test");
    res.status(200).json({ test : 'success !'});
});

// pw 체크
router.post('/pw-check', async (req,res) => {
    const { password1, password2 } = req.body;
    try{       
        if (password1 === password2) {
            return res.status(202).json({ message: 'Password matched' });
        } 
        else return res.status(401).json({ message: 'Mismatched Password' });

    } catch (error) {
        res.status(400).json({ error: 'PW Check failed' });
        console.log(error.message); 
    }
});



// 로그인 라우트
router.post('/login', async (req, res) => {
    const { id, password } = req.body; // 요청 본문 get
    try {
        const user = await User.findOne({ where: { id } });

        if (!user) {
            return res.status(400).json({ message: 'Invalid id or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid id or password' });
        }

        // JWT 액세스 토큰 생성(유효 기간 1시간)
        const token = jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // JWT 리프레시 토큰 생성 (유효 기간 7일)
        const refreshToken = jwt.sign({ id : user.id, name: user.name}, process.env.JWT_SECRET_REFRESH, { expiresIn : '7d'});

        console.log('Updating user tokens in DB'); // 업데이트 로그

        // 사용자 FCM 엑세스 토큰 업데이트 및 리프레시 토큰 업데이트
        await user.update({
            access_token : token,
            refresh_token: refreshToken,
            last_login :  new Date()
        });


        // 헤더에 토큰 생성
        res.header('Authorization', `Bearer ${token}`).send({ message: 'Logged in successfully', token, refreshToken }); // token 응답에 포함

    } catch (error) {
        res.status(400).json({ error: 'Login failed' });
        console.log(error.message);
    }
});

// 리프레시 토큰을 사용해 새로운 액세스 토큰 발급
router.post('/token', authenticateRefreshToken, async (req, res) => {

    const user = req.user;

    // 새로운 액세스 토큰 발급
    const newAccessToken = jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });

    try{
        await User.update({
            access_token : newAccessToken
        });
        res.json({ token: newAccessToken });
    }catch(error){
        console.log('Error updating token :', error.message);
        res.status(500).json({ error : 'Failed to update token'});
    }    
});

module.exports = router;