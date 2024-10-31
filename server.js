const express = require('express');
const sequelize = require('./config/database'); // database.js에서 sequelize 인스턴스 가져오기
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

// 미들웨어 가져오기
const { authenticateToken }  = require('./middleware/authenticateToken');
const cors = require('cors'); 
const path = require('path'); // path 모듈 추가

// firebase 추가
const admin = require('firebase-admin');
// push 알림 라우트
const notificationRoutes = require('./routes/notifications');
// Firebase 설정 파일 불러오기
// const serviceAccount = require('./push/firebase.json');

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
//   });

// 환경 변수 파일로드
dotenv.config();

const app = express();
app.use(express.json()); // json 파싱 미들웨어

// 연결 확인
sequelize.authenticate()
        .then(() => {
            console.log('Connect to PostgreSQL');
        })        
        .catch(err => {
            console.log('Unable to connect to the DB', err);
        });

// 허용할 출처 
app.use(cors({    origin: 'http://localhost:3000' }));        

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public'))); // 'public' 폴더에 HTML 파일 넣기



// 인증이 필요없는 인증 관련 라우트
app.use('/api/v1', authRoutes);

// 인증이 필요한 모든 API에 `/api/v1` 경로 적용
app.use('/api/v2', authenticateToken);

// 푸시 알림 라우트 추가
app.use('/api/v3', notificationRoutes);


app.get('/', function (req, res) {
    res.send('test');
});

var server = app.listen(3000,function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('server is working ! \nPORT is', port);
});



