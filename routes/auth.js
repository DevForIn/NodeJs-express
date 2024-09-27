const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User')
const router = express.Router();

// 회원가입
router.post('/register', async (req,res) => {
    const { username, password} = req.body;
    try{
        //유저 생성
        const newUser = new User({ username, password});
        await newUser.save();
        req.statusCode(201).json({message: 'User registered successfully'});
    }catch(error){
        res.status(400).json({ error: 'Registeration failed'});
    }
});

// 로그인 라우트
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try{
        const user = await User.findOne({username});
        if(!user){
            return res.status(400).json({ message : 'Invalid username or password'});
        }

        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({ message : 'Invalid username or password'});
        }

        // JWT 토큰 생성
        const token = jwt.sign({ id:user._id, username : user.username }, process.env.JWT_SECRET, { expiresIn: '1h'});
        res.json({ token });
    }catch(error){
        res.status(400).json({error : 'Login failed'});
    }    
});

// 토큰 인증 미들웨어
const authenticateToken = (req,res,next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' '[1]);

    if(!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err,user) => {
        if(err) return res.sendStatus(403);
        req.user = user;
        next();S
    });
};

// 인증된 사용자만 접근 가능한 라우트 예시 
router.get('/protected', authenticateToken, (req,res) =>{
    res.json({message : 'Hello, ${req.user.username}!'});
});