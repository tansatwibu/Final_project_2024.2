const { app, server } = require('./app');
const alertScheduler = require('./services/alert');

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  alertScheduler.start();  // Khởi cron job cảnh báo
});
