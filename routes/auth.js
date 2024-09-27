const express = require('express');
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const router = express.Router();

// 회원가입
router.post('/register', async (req,res) => {
    const { username, password} = req.body;
    try{
        //유저 생성
        const newUser = new User({ username, password});
        await newUser.save();
        res.status(201).json({message: 'User registered successfully'});
    }catch(error){
        res.status(400).json({ error: 'Registeration failed'});
        console.log(error.message);

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

        // 헤더에 토큰 생성
        res.header('Authorization', 'Bearer ${token}').send({ message : 'Logged in successfully'})
        console.log(token)
    }catch(error){
        res.status(400).json({error : 'Login failed'});
        console.log(error.message);
    }    
});

module.exports = router;