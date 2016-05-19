# Dieren Geluid

Bij mij thuis hebben we in de tuin twee varkens. Als die geluid maken dan betekend dat dat ze honger hebben. Soms ben je dan toevallig aan het stofzuigen en heb je niet door dat ze de buurt verstoren. Hiervoor heb ik een oplossing bedacht. Het idee is dat de gebruiker een overzicht heeft van het gedrag van hun dieren en ook een alarm in kan stellen op basis van hoeveel geluid er gemaakt wordt.

<img src="https://i.imgur.com/jERURQ0.jpg" width="300">
<img src="https://i.imgur.com/xuJcAY0.jpg" width="300">

## Benodigdheden

Voor dit project heb je een aantal dingen nodig om te kunnen beginnen:

- Wemos or similar ESP
- Jumper wires
- LED or speaker
- Resistors
- Sound sensor
- Breadboard

## Hardware setup

Laten we beginnen met de hardware. Maak precies na zoals je het op de foto kan zien:

<img src="https://i.imgur.com/xuJcAY0.jpg">

Zorg dat de Sound sensor (of LDR) verbonden is met de A0 input en de LED met de D8 output. 

## Arduino code

Zorg dat je de Arduino IDE hebt geïnstalleerd voordat je verder gaat.

Laten we beginnen ervoor te zorgen dat we kunnen verbinden met het internet:

```cpp
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <ESP8266HTTPClient.h>

// Vul je eigen gegevens in
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

De volgende stap is het toevoegen van de sensoren meten:

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

  // Hier map ik de analoge waarde naar een 0 tot 10 getal 
  // zodat we die verder makkelijk kunnen gebruiken
  int sound = map(soundValue, 0, 512, 0, 10);
  Serial.println("Sound Level: " + String(sound));

  int alarm = get().toInt();
  
  delay(5000);
}
```

De laatste stap is het toevoegen van de POST en de GET naar de server die we straks zullen opzetten:

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

  // Hier map ik de analoge waarde naar een 0 tot 10 getal 
  // zodat we die verder makkelijk kunnen gebruiken
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
Nu zijn we klaar met het Arduino gedeelte.

## Server en front-end

Voor de POST hebben we een data.php bestand die de geluidswaarde zal wegschrijven in een text bestand:

```php
<?php
date_default_timezone_set('Europe/Amsterdam');

$value = $_POST['alarm'];
$date = date("D M d Y H:i:s 0");
$file = "sound.txt";
$content = file_get_contents($file);
file_put_contents($file, $date . "-" . $value . "\n" . $content);
```

Zoals je kunt zien stellen we tijdzone in zodat we geen verkeerde tijden krijgen.

De GET request pakt gewoon het JSON bestand die we ook wegschrijven via PHP:

```php
<?php
$value = $_POST['alarm'];

$settings = fopen('settings.json', 'w+') or die("can't open file");

fwrite($settings, '{"alarm": "' . $value . '"}');
 
header("Location: instellingen.php");
```

Dit is alles wat we nodig hebben voor de server. De rest van de front-end code is te bekijken in deze repository.

# Conclusie

Deze combinatie van een Arduino een PHP server en een dashboard zorgt voor een mooie oplossing voor het probleem. De live site is hier te bekijken: http://iot.dennisvanbennekom.com/
