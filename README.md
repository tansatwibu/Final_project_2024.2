# Final_project_2024.2
# BÁO CÁO ĐỒ ÁN

## **1. Giới Thiệu**
### **1.1. Tên dự án**
HỆ THỐNG KIỂM TRA NĂNG SUẤT CÔNG NHÂN QUA RFID, QR CODE, BARCODE SỬ DỤNG VI ĐIỀU KHIỂN ESP32

### **1.2. Mô tả tóm tắt**
Dự án nhằm xây dựng một hệ thống giám sát năng suất công nhân trên dây chuyền sản xuất bằng cách gán thẻ RFID cho sản phẩm, sử dụng ESP32 để ghi nhận thời gian vào/ra của sản phẩm tại hai đầu dây chuyền. Dữ liệu được ghi lại và gửi lên MySQL để phân tích năng suất công nhân theo ca.

---
## **2. Mục Tiêu Dự Án**
1. Ghi nhận thời gian sản phẩm vào/ra dây chuyền.
2. Tính toán thời gian sản xuất từ khi sản phẩm bắt đầu đến khi hoàn thành.
3. Lưu trữ dữ liệu lên MySQL Server.
4. Hiển thị thông tin năng suất theo ngày, ca làm việc.

---
## **3. Cơ Sở Lý Thuyết**
### **3.1. RFID (Radio Frequency Identification)**
- RFID là công nghệ sử dụng sóng vô tuyến để truyền dữ liệu.
- Mỗi thẻ RFID có mã UID duy nhất, được dùng để nhận diện sản phẩm.
### **3.2. GM65**
- GM65 là một module quét mã vạch và QR code có kích thước nhỏ gọn, tích hợp cảm biến CMOS và thuật toán giải mã mạnh mẽ.
- Có thể quét các loại mã 1D và 2D với tốc độ cao.
- Module có thể kết nối trực tiếp đến máy tính thông qua cổng USB, gửi dữ liệu và hiển thị lên một phần mềm soạn thảo bất kì (Notepad, Word,...)
### **3.2. ESP32**
- ESP32 là vi điều khiển có WiFi, Bluetooth, vận hành tốt với RFID.
- Giao tiếp với module RFID qua SPI.
- Giao tiếp với module GM65 qua UART.(Chưa làm xong)

### **3.3. PostgreSQL**
- PostgreSQL là hệ quản trị cơ sở dữ liệu quan hệ (SQL).
- Lưu dữ liệu vào bảng **production** gồm: `id`, `product_id`, `entry_time`, `exit_time`, `duration`. (Chưa làm xong)

---
## **4. Thiết Kế Hệ Thống**
### **4.1. Sơ Đồ Kết Nối**
ESP32 giao tiếp với module RFID RC522 qua SPI và module GM65 qua UART

### **4.2. Luồng Hoạt Động**
1. RFID 1 quét thẻ → Lưu ID sản phẩm + thời gian vào.
2. RFID 2 quét thẻ → Lưu thời gian ra.
3. Tính **thời gian sản xuất** = `exit_time - entry_time`.
4. Gửi dữ liệu lên MySQL.

---
## **5. Cài Đặt & Lắp Ráp**
1. Kết nối phần cứng theo sơ đồ.
2. Làm một cơ sở dữ liệu PostgreSQL.
3. Viết code ESP32 để:
   - Kết nối WiFi.
   - Đọc thẻ RFID.
   - Lưu dữ liệu vào PostgreSQL.

---
## **6. Kết Quả
1. Chạy mạch RFID: Đã chạy thành công mạch RFID kết nối với ESP32, UID của thẻ sau khi quét cảm biến được hiển thị trên Serial Monitor của Arduino IDE.
  - Dữ liệu UID của thẻ được lưu lần lượt trên một cột trong Google sheet
2. Các phương án sử dụng module GM65:
  - Kết nối trực tiếp qua laptop: Dữ liệu QRcode, Barcode được quét và gửi trực tiếp qua kết nối USB. Hiển thị trên một ứng dụng soạn thảo bất kì (Notepad, Word)
  - Kết nối với esp32 (chưa làm xong)
3. Một module esp có thể kết nối đến 2 đầu đọc RFID. Do module RC522 giao tiếp qua SPI nên cần:
  - Chia sẻ chung các chân SCK (CLK), MISO, MOSI, GND, VCC.
  - Sử dụng chân SS (SDA/CS) riêng cho từng module.
4. Xây dựng Database sử dụng Posgresql và web server (chưa triển khai)









```bash
git clone https://github.com/yourusername/your-project.git
cd your-project

