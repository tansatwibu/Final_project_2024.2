const express = require('express');
const router = express.Router();
const shiftCtrl = require('../controllers/shift_controllers');
const auth = require('../middleware/auth');
router.get('/protected', auth, (req, res) => {
  res.json({ message: 'You are admin!' });
});

router.get('/', shiftCtrl.list);
router.post('/', shiftCtrl.create);
router.put('/:id', shiftCtrl.update);
router.delete('/:id', shiftCtrl.remove);

module.exports = router;