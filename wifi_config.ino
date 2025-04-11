#include <WiFiManager.h>
#include <SPI.h>
#include <MFRC522.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>
#include <HTTPClient.h>
#include <EEPROM.h>

// OLED
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 32
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

// RFID
#define SS_PIN 5
#define RST_PIN 4
MFRC522 rfid(SS_PIN, RST_PIN);

// EEPROM
#define EEPROM_SIZE 64
#define EEPROM_ADDR 0

// Nút cấu hình lại
#define CONFIG_BUTTON_PIN 0  // Nút BOOT trên DOIT ESP32

WiFiManager wm;
WiFiManagerParameter custom_ip("server", "Server IP", "", 32);
String serverIP = "";

// === EEPROM ===
void saveServerIP(String ip) {
  EEPROM.begin(EEPROM_SIZE);
  for (int i = 0; i < ip.length(); i++) {
    EEPROM.write(EEPROM_ADDR + i, ip[i]);
  }
  EEPROM.write(EEPROM_ADDR + ip.length(), '\0');
  EEPROM.commit();
  EEPROM.end();
}

String loadServerIP() {
  EEPROM.begin(EEPROM_SIZE);
  String ip = "";
  char c;
  for (int i = 0; i < 32; i++) {
    c = EEPROM.read(EEPROM_ADDR + i);
    if (c == '\0') break;
    ip += c;
  }
  EEPROM.end();
  return ip;
}

// === OLED ===
void showOLED(String line1, String line2 = "", String line3 = "") {
  display.clearDisplay();
  display.setCursor(0, 0);
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.println(line1);
  if (line2 != "") display.println(line2);
  if (line3 != "") display.println(line3);
  display.display();
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

  // === THAY ĐOẠN NÀY ===
  wm.addParameter(&custom_ip);

  bool enterConfig = false;
  unsigned long configWindow = millis() + 5000; // chờ 5 giây
  showOLED("Nhan BOOT de config");
  while (millis() < configWindow) {
    if (digitalRead(CONFIG_BUTTON_PIN) == LOW) {
      enterConfig = true;
      break;
    }
    delay(100);
  }

  if (enterConfig) {
    showOLED("Vao che do config");
    wm.startConfigPortal("ESP32_Config");
    serverIP = custom_ip.getValue();
    if (serverIP.length() > 0) {
      saveServerIP(serverIP);
    }
    ESP.restart();
  }

  if (!wm.autoConnect("ESP32_Config")) {
    showOLED("Ket noi that bai");
    delay(3000);
    ESP.restart();
  }

  serverIP = loadServerIP();
  showOLED("Da ket noi WiFi", "IP Server:", serverIP);
  delay(1000);

  // RFID
  SPI.begin();
  rfid.PCD_Init();
  delay(100);
  showOLED("San sang quet the");
}

void loop() {
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) {
    return;
  }

  String uid = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    uid += String(rfid.uid.uidByte[i] < 0x10 ? "0" : "");
    uid += String(rfid.uid.uidByte[i], HEX);
  }
  uid.toUpperCase();

  showOLED("UID:", uid, "Dang gui...");

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin("http://" + serverIP + ":3000/api/rfid");
    http.addHeader("Content-Type", "application/json");
    int httpCode = http.POST("{\"uid\":\"" + uid + "\"}");

    if (httpCode > 0) {
      showOLED("UID:", uid, "Da gui OK");
    } else {
      showOLED("Gui loi", "Ma loi: " + String(httpCode));
    }
    http.end();
  } else {
    showOLED("WiFi mat ket noi");
  }

  delay(2000);
  showOLED("San sang quet the");
  rfid.PICC_HaltA();
}
