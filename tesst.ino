#include <SPI.h>
#include <MFRC522.h>
#include <WiFi.h>
#include <HTTPClient.h>

#define SS_PIN 5
#define RST_PIN 22
MFRC522 rfid(SS_PIN, RST_PIN);
String uidString;

const char* ssid = "TP-Link_D4D6";
const char* password = "22173225";
String Web_App_URL = "https://script.google.com/macros/s/AKfycbwafjVoj2SEqHBP1q__naLLPies1s32wd4sW_41dNWD-_oR419zvvoGMbmbf5xnslJ-/exec";

void setup() {
    Serial.begin(115200);
    SPI.begin();
    rfid.PCD_Init();

    Serial.print("Connecting to WiFi...");
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        Serial.print(".");
        delay(1000);
    }
    Serial.println("\nConnected to WiFi.");
}

void loop() {
    if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) {
        return;
    }

    uidString = "";
    for (byte i = 0; i < rfid.uid.size; i++) {
        uidString += (rfid.uid.uidByte[i] < 0x10 ? "0" : "");
        uidString += String(rfid.uid.uidByte[i], HEX);
    }
    uidString.toUpperCase();
    Serial.println("Card UID: " + uidString);

    sendToGoogleSheet(uidString);

    rfid.PICC_HaltA();
    rfid.PCD_StopCrypto1();
}

void sendToGoogleSheet(String uid) {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        String Send_Data_URL = Web_App_URL + "?sts=writeuid&uid=" + uid;
        
        http.begin(Send_Data_URL.c_str());
        http.setFollowRedirects(HTTPC_STRICT_FOLLOW_REDIRECTS);
        
        int httpCode = http.GET();
        if (httpCode > 0) {
            Serial.println("Data sent successfully.");
        } else {
            Serial.println("Failed to send data.");
        }
        http.end();
    }
}
