const router = require('express').Router();
const ctrl = require('../controllers/attendance_controllers');
const auth = require('../middleware/auth');
router.get('/protected', auth, (req, res) => {
  res.json({ message: 'You are admin!' });
});
router.post('/scan', ctrl.scan);   // từ ESP32
router.get('/status', ctrl.status);
router.get('/logs', ctrl.getAttendanceLogs);
module.exports = router;
