//NodeMcu Code for Two way Communication between firebase and NodeMcu.
#if defined(ESP32)
#include <WiFi.h>
#include <WiFiUdp.h>
#include <FirebaseESP32.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>
#endif

#include <WiFiUdp.h>
#include <NTPClient.h>

//WiFiUDP ntpUDP;
WiFiUDP ntpUDP;                                       // Initialize the UDP object
NTPClient timeClient(ntpUDP, "pool.ntp.org", 19800);  // Pass the UDP object to NTPClient

//Provide the token generation process info.
#include <addons/TokenHelper.h>

//Provide the RTDB payload printing info and other helper functions.
#include <addons/RTDBHelper.h>

/* 1. Define the WiFi credentials */
#define WIFI_SSID "Shri"
#define WIFI_PASSWORD "november"

//For the following credentials, see examples/Authentications/SignInAsUser/EmailPassword/EmailPassword.ino

/* 2. Define the API Key */
#define API_KEY "AIzaSyDLMFIlXtAiAo066IGvH7jhnhaLLx7PROk"

/* 3. Define the RTDB URL */
#define DATABASE_URL "https://circuitmind-29-default-rtdb.asia-southeast1.firebasedatabase.app/"  //<databaseName>.firebaseio.com or <databaseName>.<region>.firebasedatabase.app

/* 4. Define the user Email and password that alreadey registerd or added in your project */
#define USER_EMAIL "rshricharan29@gmail.com"
#define USER_PASSWORD "29Nov2006"

//Define Firebase Data object
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
String appdata = "";


unsigned long count = 0;

String getCurrentTimeString() {
  timeClient.update();
  time_t now = timeClient.getEpochTime();
  struct tm *timeinfo;
  timeinfo = localtime(&now);
  char buffer[30];
  strftime(buffer, sizeof(buffer), "%A, %Y-%m-%d %H:%M:%S", timeinfo);
  return String(buffer);
}

#define red D1
#define yellow D2
#define green D3

void setup() {

  Serial.begin(115200);

  // Led control
  pinMode(red, OUTPUT);
  pinMode(yellow, OUTPUT);
  pinMode(green, OUTPUT);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  Serial.printf("Firebase Client v%s\n\n", FIREBASE_CLIENT_VERSION);

  /* Assign the api key (required) */
  config.api_key = API_KEY;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  config.database_url = DATABASE_URL;

  config.token_status_callback = tokenStatusCallback;  //see addons/TokenHelper.h

  Firebase.begin(&config, &auth);

  Firebase.reconnectWiFi(true);

  Firebase.setDoubleDigits(5);

  timeClient.begin();
  //timeClient.setTimeOffset(19800); // UTC+5:30 for India
}

float ph = random(6.5, 8.5);
float turbidity = random(0, 5);
float d_o = random(5, 14);
float temp = random(10, 25);
float ec = random(0, 500);
float changeProbability = 0.7;

void loop() {

  // Bernoulli randomization for each variable
  if (random(0, 100) < changeProbability * 100) {
    ph += random(-10, 11) * 0.01;  // Small changes, ±0.1
  }
  if (random(0, 100) < changeProbability * 100) {
    turbidity += random(-5, 6) * 0.1;  // Small changes, ±0.5
  }
  if (random(0, 100) < changeProbability * 100) {
    d_o += random(-5, 6) * 0.1;  // Small changes, ±0.5
  }
  if (random(0, 100) < changeProbability * 100) {
    temp += random(-2, 3) * 0.1;  // Small changes, ±0.2
  }
  if (random(0, 100) < changeProbability * 100) {
    ec += random(-20, 21);  // Small changes, ±20
  }

  // Constrain values within realistic ranges
  ph = constrain(ph, 6.5, 8.5);
  turbidity = constrain(turbidity, 0, 5);
  d_o = constrain(d_o, 5, 14);
  temp = constrain(temp, 10, 25);
  ec = constrain(ec, 0, 500);

  float Sph;
  if (ph >= 6.5 && ph <= 8.5)
    Sph = 1 - abs(ph - 7.5) / 2.5;
  else Sph = 0;

  float Sturb;
  if (turbidity >= 0 && turbidity <= 5)
    Sturb = 1 - turbidity / 5;
  else Sturb = 0;

  float Sdo;
  if (d_o >= 0 && d_o <= 14)
    Sdo = (d_o - 5) / 9;
  else Sdo = 0;

  float Sec;
  if (ec >= 0 && ec <= 500)
    Sec = 1 - ec / 500;
  else Sec = 0;

  float Stemp;
  if (temp >= 0 && temp <= 25)
    Stemp = 1 - abs(temp - 17.5) / 7.5;
  else Stemp = 0;

  float p = 0.2 * Sph + 0.15 * Sturb + 0.25 * Sdo + 0.2 * Sec + 0.2 * Stemp;

  int dataToSend;

  // if (p > 0.75) dataToSend = 1;
  // else if (p >= 0.5 && p <= 0.75) dataToSend = 2;
  // else dataToSend = 3;

  // Prototype: Using Arduino
  // digitalWrite(D8, LOW);                                  // Begin SPI transaction
  // SPI.transfer((byte *)&dataToSend, sizeof(dataToSend));  // Send integer as bytes
  // digitalWrite(D8, HIGH);                                 // End SPI transaction

  digitalWrite(red, LOW);
  digitalWrite(yellow, LOW);
  digitalWrite(green, LOW);

  if (p > 0.7)
    digitalWrite(green, HIGH);
  else if (p >= 0.5 && p <= 0.7)
    digitalWrite(yellow, HIGH);
  else
    digitalWrite(red, HIGH);

  if (Firebase.ready() && (millis() - sendDataPrevMillis > 1000 || sendDataPrevMillis == 0)) {
    sendDataPrevMillis = millis();

    Serial.printf("Set ph... %s\n", Firebase.setFloat(fbdo, F("/sensorData/ph"), ph) ? "ok" : fbdo.errorReason().c_str());
    Serial.printf("Set turbidity... %s\n", Firebase.setFloat(fbdo, F("/sensorData/turbidity"), turbidity) ? "ok" : fbdo.errorReason().c_str());
    Serial.printf("Set dissolved_oxygen... %s\n", Firebase.setFloat(fbdo, F("/sensorData/do"), d_o) ? "ok" : fbdo.errorReason().c_str());
    Serial.printf("Set temperature... %s\n", Firebase.setFloat(fbdo, F("/sensorData/temperature"), temp) ? "ok" : fbdo.errorReason().c_str());
    Serial.printf("Set electrical_conductivity... %s\n", Firebase.setFloat(fbdo, F("/sensorData/ec"), ec) ? "ok" : fbdo.errorReason().c_str());
    Serial.printf("Set Parameter... %s\n", Firebase.setFloat(fbdo, F("/parameter/param"), p) ? "ok" : fbdo.errorReason().c_str());

    Serial.println();
    count++;
  }

  delay(5000);
}