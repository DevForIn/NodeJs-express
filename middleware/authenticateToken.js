const jwt = require('jsonwebtoken');

// 토큰 인증 미들웨어
const authenticateToken = (req,res,next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

        if(err) return res.sendStatus(403);

        req.user = user;
        next();
    });
};

// 리프레시 토큰 인증 미들웨어
const authenticateRefreshToken = (req, res, next) => {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) return res.status(401).json({ message: 'Refresh token required' });

    jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH, (err, user) => {
        if (err) {
            // 리프레시 토큰 만료 시 로그인 재요청
            if (err.name === 'TokenExpiredError') {
                return res.status(403).json({ message: 'Refresh token expired. Please log in again.' });
            }
            return res.status(403).json({ message: 'Invalid refresh token' });
        }
        req.user = user;
        next();
    });
};

module.exports = { authenticateToken, authenticateRefreshToken };



