#include <WiFiManager.h>
#include <SPI.h>
#include <MFRC522.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>
#include <HTTPClient.h>
#include <EEPROM.h>
#include <time.h>

// OLED
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 32
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

// RFID
#define SS_PIN 5
#define RST_PIN 4
MFRC522 rfid(SS_PIN, RST_PIN);

// EEPROM
#define EEPROM_SIZE 128
#define EEPROM_ADDR_IP 0
#define EEPROM_ADDR_UID 64

// Nút cấu hình
#define CONFIG_BUTTON_PIN 0  // nút BOOT

// GM65 - UART2
#define GM65_RX 16
#define GM65_TX 17
HardwareSerial GM65Serial(2);

// WiFi Manager
WiFiManager wm;
WiFiManagerParameter custom_ip("server", "Server IP", "", 32);
String serverIP = "";

// Trạng thái làm việc
bool isWorking = false;
String currentUID = "";
String lastRFIDTimestamp = "";

unsigned long lastModeCheck = 0;
String currentMode = "attendance";

// ===== EEPROM =====
void saveStringToEEPROM(int addr, String data) {
  EEPROM.begin(EEPROM_SIZE);
  for (int i = 0; i < data.length(); i++) {
    EEPROM.write(addr + i, data[i]);
  }
  EEPROM.write(addr + data.length(), '\0');
  EEPROM.commit();
  EEPROM.end();
}

String readStringFromEEPROM(int addr) {
  EEPROM.begin(EEPROM_SIZE);
  String data = "";
  char c;
  for (int i = 0; i < 64; i++) {
    c = EEPROM.read(addr + i);
    if (c == '\0') break;
    data += c;
  }
  EEPROM.end();
  return data;
}

void saveServerIP(String ip) {
  saveStringToEEPROM(EEPROM_ADDR_IP, ip);
}

String loadServerIP() {
  return readStringFromEEPROM(EEPROM_ADDR_IP);
}

void saveLastUID(String uid) {
  saveStringToEEPROM(EEPROM_ADDR_UID, uid);
}

String loadLastUID() {
  return readStringFromEEPROM(EEPROM_ADDR_UID);
}

// ===== OLED =====
void showOLED(String l1, String l2 = "", String l3 = "") {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(0, 0);
  display.println(l1);
  if (l2 != "") display.println(l2);
  if (l3 != "") display.println(l3);
  display.display();
}

// ===== Timestamp ISO 8601 (UTC) =====
String getCurrentTimestamp() {
  struct tm timeinfo;
  if (getLocalTime(&timeinfo)) {
    char buf[40];
    strftime(buf, sizeof(buf), "%Y-%m-%dT%H:%M:%S", &timeinfo);
    return String(buf) + ".000Z";
  }
  return "";
}

// ===== Thêm hàm lấy chế độ từ server =====
void updateRFIDMode() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = "http://" + serverIP + ":5000/api/rfid/mode";
    http.begin(url);
    int code = http.GET();
    if (code == 200) {
      String res = http.getString();
    if (res.indexOf("add_employee") > -1) {
        currentMode = "add_employee";
        showOLED("Quet the", "de them NV");
        }
    else {
      currentMode = "attendance";
      showOLED("San sang quet the");
    }
    http.end();
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(CONFIG_BUTTON_PIN, INPUT_PULLUP);
  EEPROM.begin(EEPROM_SIZE);

  // OLED
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("OLED loi!");
    while (1);
  }
  showOLED("Dang khoi dong...");
  delay(500);

  // WiFi Config
  wm.addParameter(&custom_ip);
  bool enterConfig = false;
  unsigned long cfgWin = millis() + 5000;
  showOLED("Nhan BOOT de config");
  while (millis() < cfgWin) {
    if (digitalRead(CONFIG_BUTTON_PIN) == LOW) {
      enterConfig = true; break;
    }
    delay(100);
  }
  if (enterConfig) {
    showOLED("Vao che do config");
    wm.startConfigPortal("ESP32_Config");
    serverIP = custom_ip.getValue();
    if (serverIP.length()) saveServerIP(serverIP);
    showOLED("Cau hinh xong","Khoi dong lai...");
    delay(2000);
    ESP.restart();
  }
  if (!wm.autoConnect("ESP32_Config")) {
    showOLED("Ket noi that bai");
    delay(3000);
    ESP.restart();
  }
  serverIP = loadServerIP();
  showOLED("Da ket noi WiFi","IP Server:" + serverIP);
  delay(1000);

  // NTP UTC
  configTime(0, 0, "pool.ntp.org", "time.nist.gov");
  showOLED("Dong bo NTP...");
  struct tm ti;
  while (!getLocalTime(&ti)) {
    Serial.println("Loi dong bo thoi gian");
    delay(1000);
  }
  showOLED("Dong bo NTP OK");

  // RFID + GM65
  SPI.begin();
  rfid.PCD_Init();
  delay(100);
  GM65Serial.begin(9600, SERIAL_8N1, GM65_RX, GM65_TX);

   // Khôi phục UID nếu đang làm việc
  String lastUID = loadLastUID();
  if (lastUID.length() > 0) {
    HTTPClient http;
    String url = "http://" + serverIP + ":5000/api/attendance/status?rfid=" + lastUID;
    http.begin(url);
    int code = http.GET();
    if (code == 200) {
      String res = http.getString();
      // Giả sử server trả JSON: {"isWorking":true, ...}
      if (res.indexOf("\"status\":\"IN\"") > -1) {
        isWorking = true;
        currentUID = lastUID;
        showOLED("Khoi phuc ca lam", currentUID);
        delay(1500);
      } else {
        isWorking = false;
        currentUID = "";
        saveLastUID("");  // Xóa nếu không còn ca làm việc
      }
    }
    http.end();
  }
  // Hiển thị chuẩn bị quét thẻ
  showOLED("San sang quet the");
}


void loop() {

  if (millis() - lastModeCheck > 2000) { // mỗi 2 giây
    lastModeCheck = millis();
    updateRFIDMode();
  }
// ===== RFID =====
  if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
    String uid = "";
    for (byte i = 0; i < rfid.uid.size; i++) {
      uid += String(rfid.uid.uidByte[i] < 0x10 ? "0" : "");
      uid += String(rfid.uid.uidByte[i], HEX);
    }
    uid.toUpperCase();
    uid.trim();

    if (currentMode == "add_employee") {
      // Gửi lên endpoint thêm công nhân
      if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        String url = "http://" + serverIP + ":5000/api/rfid/scan";
        http.begin(url);
        http.addHeader("Content-Type", "application/json");
        String pay = "{\"rfid\":\"" + uid + "\"}";
        int code = http.POST(pay);
        http.end();
        showOLED("Gui RFID them NV", uid);
      } else {
        showOLED("WiFi mat ket noi");
      }
      delay(2000);
      showOLED("San sang quet the");
      rfid.PICC_HaltA();
      return;
    }
    String ts = getCurrentTimestamp();
    showOLED("UID:", uid, "Dang gui...");

    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      String url = "http://" + serverIP + ":5000/api/attendance/scan";
      http.begin(url);
      http.addHeader("Content-Type", "application/json");
      String pay = "{\"rfid\":\"" + uid + "\",\"timestamp\":\"" + ts + "\"}";
      int code = http.POST(pay);
      if (code > 0) {
        String response = http.getString();
        Serial.println("Phan hoi: " + response);

        if (isWorking) {
          if (uid == currentUID) {
            // Kết thúc ca
            isWorking = false;
            currentUID = "";
            lastRFIDTimestamp = "";
            saveLastUID("");  // xóa UID trong EEPROM
            showOLED("Ket thuc ca", uid);
          } else {
            // Đang làm việc với thẻ khác
            showOLED("Dang lam viec", currentUID);
          }
        } else {
          // Bắt đầu ca làm việc mới
          isWorking = true;
          currentUID = uid;
          lastRFIDTimestamp = ts;
          saveLastUID(uid); // lưu vào EEPROM
          showOLED("Bat dau ca", uid);
        }
      } else {
        Serial.println("Loi khi gui UID: " + String(code));
        showOLED("Gui loi", "Ma loi:" + String(code));
      }
      http.end();
    } else {
      showOLED("WiFi mat ket noi");
    }

    delay(2000);
    showOLED("San sang quet the");
    rfid.PICC_HaltA();
  }

  // ===== GM65 QR/barcode =====
  if (GM65Serial.available()) {
    String qr = GM65Serial.readStringUntil('\n');
    qr.trim();

    if (qr.length() > 0) {
      if (WiFi.status() != WL_CONNECTED) {
        showOLED("WiFi mat ket noi");
        delay(2000);
        showOLED("San sang quet the");
        return;
      }

      if (isWorking && currentUID.length() > 0) {
        showOLED("QR:", qr, "Dang gui...");

        String ts2 = getCurrentTimestamp();
        HTTPClient httpQR;
        String url = "http://" + serverIP + ":5000/api/production/scan";
        httpQR.begin(url);
        httpQR.addHeader("Content-Type", "application/json");
        String pay2 = "{";
        pay2 += "\"rfid\":\"" + currentUID + "\",";
        pay2 += "\"productCode\":\"" + qr + "\",";
        pay2 += "\"timestamp\":\"" + ts2 + "\",";
        pay2 += "\"quantity\":1}";
        int code2 = httpQR.POST(pay2);
        if (code2 > 0) {
          Serial.println("Phan hoi: " + httpQR.getString());
          showOLED("QR:", qr, "Da gui OK");
        } else {
          Serial.println("Loi khi gui QR: " + String(code2));
          showOLED("Gui loi", "Ma loi:" + String(code2));
        }
        httpQR.end();
      } else {
        showOLED("Chua quet the", "De bat dau ca");
      }

      delay(2000);
      showOLED("San sang quet the");
    }
  }
}