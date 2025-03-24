# Final_project_2024.2
# BÁO CÁO ĐỒ ÁN

## **1. Giới Thiệu**
### **1.1. Tên dự án**
HỆ THỐNG KIỂM TRA NĂNG SUẤT CÔNG NHÂN BẰNG RFID VÀ ESP8266

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

### **3.2. ESP32**
- ESP32 là vi điều khiển có WiFi, Bluetooth, vận hành tốt với RFID.
- Giao tiếp với module RFID qua SPI.

### **3.3. MySQL**
- MySQL là hệ quản trị cơ sở dữ liệu quan hệ (SQL).
- Lưu dữ liệu vào bảng **production** gồm: `id`, `product_id`, `entry_time`, `exit_time`, `duration`. (Chưa làm xong)

---
## **4. Thiết Kế Hệ Thống**
### **4.1. Sơ Đồ Kết Nối**
ESP32 giao tiếp với 2 module RFID RC522 qua SPI:

### **4.2. Luồng Hoạt Động**
1. RFID 1 quét thẻ → Lưu ID sản phẩm + thời gian vào.
2. RFID 2 quét thẻ → Lưu thời gian ra.
3. Tính **thời gian sản xuất** = `exit_time - entry_time`.
4. Gửi dữ liệu lên MySQL.

---
## **5. Cài Đặt & Lắp Ráp**
1. Kết nối phần cứng theo sơ đồ.
2. Làm một cơ sở dữ liệu MySQL.
3. Viết code ESP32 để:
   - Kết nối WiFi.
   - Đọc thẻ RFID.
   - Lưu dữ liệu vào MySQL.

---
## **6. Kết Quả & Đánh Giá**
### **6.1. Kết Quả**
- Hệ thống đo được thời gian sản xuất của từng sản phẩm.
- Gửi dữ liệu vào MySQL thành công.
- Truy vấn vào bảng MySQL để phân tích dữ liệu.

### **6.2. Hạn Chế & Hướng Phát Triển**
- **Hạn chế**: Có độ trễ sai nếu RFID không đọc được thẻ.
- **Phát triển**:
  - kết hợp thêm với mã QR và mã vạch
  - Kết hợp màn OLED hiển thị năng suất theo giờ.
  - Thêm cảm biến h
