const express = require('express');
const User = require('../models/User');
const admin = require('firebase-admin');
const router = express.Router();

// 푸시 알림 보내는 함수
function sendNotification(token, message) {
  const payload = {
    notification: {
      title: message.title,
      body: message.body,
    },
  };

  admin.messaging().sendToDevice(token, payload)
    .then((response) => {
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
}

router.post('/send-notification', async (req, res) => {
  const { username, message } = req.body;

  try {
    // 사용자 조회
    const user = await User.findOne({ where: { username } });

    if (!user || !user.fcm_token) {
      return res.status(404).json({ error: 'User or FCM token not found' });
    }

    // 푸시 알림 발송
    sendNotification(user.fcm_token, message);

    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error sending notification' });
  }
});


module.exports = router; // 여기서 router를 올바르게 내보내고 있습니다.