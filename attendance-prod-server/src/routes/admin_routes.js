const router = require('express').Router();
const ctrl = require('../controllers/admin_controllers');
router.post('/login', ctrl.login);
module.exports = router;