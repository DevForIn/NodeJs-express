const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const catRoutes = require('./routes/cats')
// 미들웨어 가져오기
const authenticateToken = require('./middleware/authenticateToken');

dotenv.config();

const app = express();
app.use(express.json()); // json 파싱 미들웨어

// MongoDB Connect
mongoose.connect('mongodb://localhost:27017/test',{ 
        useNewUrlParser: true,
        useUnifiedTopology: true 
    }
);

// 연결 확인
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB Complate');
});

// 인증이 필요한 모든 API에 `/api/v1` 경로 적용
app.use('/api/v1', authenticateToken, catRoutes);

// 인증이 필요없는 인증 관련 라우트
app.use('/api/auth', authRoutes);


app.get('/', function (req, res) {
    res.send('test');
});



var server = app.listen(3000,function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('server is working ! \nPORT is', port);
});

