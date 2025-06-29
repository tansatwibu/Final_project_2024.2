# HƯỚNG DẪN CÀI ĐẶT
## Cài dependancy
```bash
cd Final-sys
npm install
cd Final-sys/attendance-frontend
npm install
cd Final-sys/attendance-prod-server
npm install
npx prisma migrate dev --name init
npx prisma generate
```
## Chạy dự án
```bash
cd Final-sys
npm run dev
```