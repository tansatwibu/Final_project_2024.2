const router = require('express').Router();

router.post('/scan', (req, res) => {
  const { rfid } = req.body;
  const mode = req.app.get('rfidMode');
  if (mode === 'add_employee') {
    const io = req.app.get('io');
    io.emit('rfid_scanned', rfid);
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Not in add_employee mode' });
  }
});

// Chuyển các route mode vào đây:
router.post('/mode', (req, res) => {
  const { mode } = req.body;
  req.app.set('rfidMode', mode);
  res.json({ success: true, mode });
});

router.get('/mode', (req, res) => {
  const mode = req.app.get('rfidMode');
  res.json({ mode });
});

module.exports = router;