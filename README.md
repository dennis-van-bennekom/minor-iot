# Animal Sound

At home we have two pigs. When they make sound it means they are hungry. Sometimes you are cleaning the house and you can't hear if they make sound and disturb the people around you. I made a solution for this problem. The idea is that the user can view the behaviour of their animals. An alarm can also be set to a specific sound level.

<img src="https://i.imgur.com/jERURQ0.jpg" width="300">
<img src="https://i.imgur.com/xuJcAY0.jpg" width="300">

## Benodigdheden

For this project you need a few things to get started:

- Wemos or similar ESP
- Jumper wires
- LED or speaker
- Resistors
- Sound sensor
- Breadboard

## Hardware setup

Let's start with the hardware, make sure it looks like the picture below.

<img src="https://i.imgur.com/xuJcAY0.jpg">

Make sure the sound sensor (or LDR) is connected to the A0 input and the LED with the D8 output.

## Arduino code

Install the Arduino IDE before going further.

At first we make a connection to the internet.

```cpp
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <ESP8266HTTPClient.h>

// Fill in your own connection info
const char* ssid = "jeinternet";
const char* pass = "supergeheim";

const char* hostPost = "http://iot.dennisvanbennekom.com/data.php";
const char* hostGet = "http://iot.dennisvanbennekom.com/settings.json";

HTTPClient http;

void post(int value) {
  
}

String get() {
  
}

void setup() {
  Serial.begin(9600);

  WiFi.begin(ssid, pass);

  Serial.print("Connecting.");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println();
  Serial.println("Connected!");
}

void loop() {
  delay(5000);
}
```

The next step is to measure the sensor and set the data:

```cpp
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <ESP8266HTTPClient.h>

int soundValue = 0;

const char* ssid = "jeinternet";
const char* pass = "supergeheim";

const char* hostPost = "http://iot.dennisvanbennekom.com/data.php";
const char* hostGet = "http://iot.dennisvanbennekom.com/settings.json";

HTTPClient http;

void post(int value) {
  
}

String get() {
  
}

void setup() {
  pinMode(A0, INPUT);
  pinMode(D8, OUTPUT);
  
  Serial.begin(9600);

  WiFi.begin(ssid, pass);

  Serial.print("Connecting.");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println();
  Serial.println("Connected!");
}

void loop() {
  soundValue = analogRead(A0);

  // We map the value to a 0 to 10 range so it's easier to use later
  int sound = map(soundValue, 0, 512, 0, 10);
  Serial.println("Sound Level: " + String(sound));

  int alarm = get().toInt();
  
  delay(5000);
}
```

The final step is adding the POST and GET requests to the server we will setup later:

```cpp
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <ESP8266HTTPClient.h>

int soundValue = 0;

const char* ssid = "jeinternet";
const char* pass = "supergeheim";

const char* hostPost = "http://iot.dennisvanbennekom.com/data.php";
const char* hostGet = "http://iot.dennisvanbennekom.com/settings.json";

HTTPClient http;

void post(int value) {
  http.begin(hostPost);
  http.addHeader("Content-Type", "application/x-www-form-urlencoded");

  String payload = "alarm=" + String(value);

  int httpCode = http.POST(payload);

  if (httpCode > 0) {
    Serial.println("POST Success");
    String response = http.getString();
  } else {
    Serial.println(http.errorToString(httpCode).c_str());
  }

  http.end();
}

String get() {
  http.begin(hostGet);
  int httpCode = http.GET();

  if (httpCode > 0) {
    String response = http.getString();
    Serial.print("Response: ");
    Serial.println(response);
    StaticJsonBuffer<200> jsonBuffer;

    JsonObject& root = jsonBuffer.parseObject(response);
    String alarm = root["alarm"];

    http.end();

    return alarm;
  } else {
    Serial.println(http.errorToString(httpCode).c_str());

    http.end();
    
    return String();
  }
}

void setup() {
  pinMode(A0, INPUT);
  pinMode(D8, OUTPUT);
  
  Serial.begin(9600);

  WiFi.begin(ssid, pass);

  Serial.print("Connecting.");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println();
  Serial.println("Connected!");
}

void loop() {
  soundValue = analogRead(A0);

  int sound = map(soundValue, 0, 512, 0, 10);
  Serial.println("Sound Level: " + String(sound));
  
  post(sound);

  int alarm = get().toInt();

  if (sound >= alarm) {
    digitalWrite(D8, HIGH);
  } else {
    digitalWrite(D8, LOW);
  }
  
  delay(5000);
}
```
Now the arduino part is done.

## Server en front-end

The POST to the data.php file will handle the sound values and write them to a text file:

```php
<?php
date_default_timezone_set('Europe/Amsterdam');

$value = $_POST['alarm'];
$date = date("D M d Y H:i:s 0");
$file = "sound.txt";
$content = file_get_contents($file);
file_put_contents($file, $date . "-" . $value . "\n" . $content);
```

We make sure to set the correct timezone so we don't get wrong data.

The GET request simply reads the JSON file we write in the PHP file:

```php
<?php
$value = $_POST['alarm'];

$settings = fopen('settings.json', 'w+') or die("can't open file");

fwrite($settings, '{"alarm": "' . $value . '"}');
 
header("Location: instellingen.php");
```

That's all we need for the server. The front-end code can be found in this repository.

# Conclusion

This combination of an arduino a PHP server and a dashboard is a good solution for the problem. The live site can be seen here: http://iot.dennisvanbennekom.com/
