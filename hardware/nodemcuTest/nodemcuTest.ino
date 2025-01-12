void setup() {
    pinMode(LED_BUILTIN, OUTPUT); // Set built-in LED as an output
}

void loop() {
    digitalWrite(LED_BUILTIN, LOW); // Turn LED on
    delay(500);                     // Wait for 500ms
    digitalWrite(LED_BUILTIN, HIGH); // Turn LED off
    delay(500);                     // Wait for 500ms
}
