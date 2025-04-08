#include <WiFi.h>
#include <HTTPClient.h>
#include <SPI.h>
#include <MFRC522.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// Thông tin WiFi & server

const char* ssid = "TP-Link_D4D6";  
const char* password = "22173225";
const char* serverUrl = "http://192.168.0.102:3000/api/rfid";
// OLED
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 32
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

// RC522
#define SS_PIN 5
#define RST_PIN 4
MFRC522 rfid(SS_PIN, RST_PIN);

void setup() {
  Serial.begin(115200);

  // Kết nối WiFi
  WiFi.begin(ssid, password);
  Serial.print("Dang ket noi WiFi...");
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.println("Ket noi WiFi...");
  display.display();

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("Da ket noi WiFi!");
  display.clearDisplay();
  display.setCursor(0, 0);
  display.println("WiFi OK");
  display.display();
  delay(1000);

  // Khởi tạo RFID
  SPI.begin();
  rfid.PCD_Init();
  Serial.println("Khoi tao RC522 OK");
  display.clearDisplay();
  display.setCursor(0, 0);
  display.println("San sang quet the");
  display.display();
}

void sendUIDtoServer(String uid) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    String jsonData = "{\"uid\":\"" + uid + "\"}";
    int httpResponseCode = http.POST(jsonData);

    if (httpResponseCode > 0) {
      Serial.println("Gui UID thanh cong");
    } else {
      Serial.printf("Loi khi gui: %s\n", http.errorToString(httpResponseCode).c_str());
    }
    http.end();
  } else {
    Serial.println("WiFi khong ket noi");
  }
}

void loop() {
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) {
    return;
  }

  // Lấy UID
  String uidStr = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    if (rfid.uid.uidByte[i] < 0x10) uidStr += "0";
    uidStr += String(rfid.uid.uidByte[i], HEX);
  }
  uidStr.toUpperCase();

  // In lên Serial + OLED
  Serial.println("UID: " + uidStr);

  display.clearDisplay();
  display.setTextSize(1);
  display.setCursor(0, 0);
  display.println("The da quet:");
  display.setTextSize(2);
  display.setCursor(0, 16);
  display.println(uidStr);
  display.display();

  // Gửi lên server
  sendUIDtoServer(uidStr);

  delay(1000); // Chờ để tránh đọc lặp
  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
}
