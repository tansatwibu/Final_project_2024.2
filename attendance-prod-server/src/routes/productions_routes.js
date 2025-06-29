const router = require('express').Router();
const ctrl = require('../controllers/productions_controllers');
const auth = require('../middleware/auth');
router.get('/protected', auth, (req, res) => {
  res.json({ message: 'You are admin!' });
});
router.post('/scan', ctrl.scan);   // từ GM65
router.get('/logs', ctrl.getProductionLogs);
module.exports = router;
