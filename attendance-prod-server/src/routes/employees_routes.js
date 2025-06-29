const router = require('express').Router();
const ctrl = require('../controllers/employees_controllers');
const auth = require('../middleware/auth');
router.get('/protected', auth, (req, res) => {
  res.json({ message: 'You are admin!' });
});
router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);
router.post('/login', ctrl.loginEmployee);

module.exports = router;
