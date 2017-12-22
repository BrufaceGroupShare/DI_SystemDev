//Kien
//This code use RTOS to parallelly implement 3 tasks
//+ Send out control signal to LCDs
//+ Receive data from serial comm and update global variable
//+ Receive changes from rotary encoder and update shared variable


#include <ChibiOS_AVR.h>

  //Define output pins
  const uint8_t LED_PIN = 13;
  
  const uint8_t LCLV1 = 3; //Left
  const uint8_t LCLV2 = 5; // Right
  const uint8_t LCLV3 = 6; //Bottom
  //const uint8_t LCLV4 = 9;

  const uint8_t POTE = 0;

  const uint8_t upperbound1 = 63;
  const uint8_t upperbound2 = 127;
  const uint8_t upperbound3 = 190;
  volatile uint32_t valOpacityLevel = 0;

// declare and initialize a mutex for limiting access to threads
MUTEX_DECL(demoMutex);

// data structures and stack for thread 1
static THD_WORKING_AREA(waTh1, 100);

// data structures and stack for thread 2
static THD_WORKING_AREA(waTh2, 128);

// data structures and stack for thread 3
static THD_WORKING_AREA(waTh3, 128);



//------------------------------------------------------------------------------
// Thread 1 Send out control signal
// 100 byte stack beyond task switch and interrupt needs

static THD_WORKING_AREA(waThread1, 100);

static THD_FUNCTION(Thread1, arg) {

  while (TRUE) {
    //Main thread task
    analogWrite(LCLV1, valOpacityLevel);
    analogWrite(LCLV2, valOpacityLevel);
    analogWrite(LCLV3, valOpacityLevel);
    //analogWrite(LCLV4, valOpacityLevel);
    // allow other threads to run for 1 sec
    chThdSleepMilliseconds(1000);
  }
}
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Thread 2 Read incoming serial character and update LCD level with mutex
// 128 byte stack beyond task switch and interrupt needs
static THD_WORKING_AREA(waThread2, 128);

static THD_FUNCTION(Thread2, arg) {
  
  while (true) {
    char c = Serial.read();

    while(c && c != -1) {
      //Serial.println(c);
      //break;
      switch (c) {
          case '0':
            // statements
            chMtxLock(&demoMutex);
            valOpacityLevel = 0;
            //Serial.println(c);
            //Serial.println(valOpacityLevel);
            chMtxUnlock(&demoMutex);
            break;
          case '1':
            // statements
            chMtxLock(&demoMutex);
            valOpacityLevel = upperbound1;
            chMtxUnlock(&demoMutex);
            break;
          case '2':
            // statements
            chMtxLock(&demoMutex);
            valOpacityLevel = upperbound2;
            chMtxUnlock(&demoMutex);
            break;
          case '3':
            // statements
            //chMtxLock(&demoMutex);
            valOpacityLevel = upperbound3;
            //chMtxUnlock(&demoMutex);
            break;
          case '4':
            // statements
            chMtxLock(&demoMutex);
            valOpacityLevel = 255;
            //Serial.println(c);
            //Serial.println(valOpacityLevel);
            chMtxUnlock(&demoMutex);
            break;
          default:
            break;
        }
        break;
    }
  }
}
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Thread 3 Read incoming rotary value and update shared variable of brightness
// 128 byte stack beyond task switch and interrupt needs
static THD_WORKING_AREA(waThread3, 128);

static THD_FUNCTION(Thread3, arg) {

  while (TRUE) {
    chThdSleepMilliseconds(1000);
    uint32_t readValue = analogRead(POTE);
    Serial.print("Rea:" +readValue);
    Serial.println(readValue);
    Serial.print("Cur:");
    Serial.println(valOpacityLevel);
    if(readValue >= 0 && abs(readValue - valOpacityLevel) > 10){
      //case when in range from 0 to 63
      if(analogRead(POTE) >= 0 && analogRead(POTE) < upperbound1){
        chMtxLock(&demoMutex);
          valOpacityLevel = 0;
          chMtxUnlock(&demoMutex);
          Serial.print("Upd:");
          Serial.println(valOpacityLevel);
      }
      //case when in range from 63 to 127
      else if(analogRead(POTE) >= upperbound1 && analogRead(POTE) < upperbound2){
          chMtxLock(&demoMutex);
          valOpacityLevel = upperbound1;
          chMtxUnlock(&demoMutex);
      }
      //case when in range from 127 to 190
      else if(analogRead(POTE) >= upperbound2 && analogRead(POTE) < upperbound3){
          chMtxLock(&demoMutex);
          valOpacityLevel = upperbound2;
          chMtxUnlock(&demoMutex);
      }
      //case when in range from 63 to 127
      else if(analogRead(POTE) >= upperbound3 && analogRead(POTE) < 200){
          chMtxLock(&demoMutex);
          valOpacityLevel = upperbound3;
          chMtxUnlock(&demoMutex);
      }
      else if(analogRead(POTE) >= 200 && analogRead(POTE) < 255){
          chMtxLock(&demoMutex);
          valOpacityLevel = 255;
          chMtxUnlock(&demoMutex);
      }
    }
  }
}
//------------------------------------------------------------------------------


void setup() {
  //Arduino setup
  //Set ouput pin
  pinMode(LCLV1, OUTPUT);
  pinMode(LCLV2, OUTPUT);
  pinMode(LCLV3, OUTPUT);
  pinMode(LCLV4, OUTPUT);

  //Set input pin
  pinMode(POTE, INPUT);
  
  Serial.begin(9600);

  //Initial the state of the headset's LCDs
  analogWrite(LCLV1, 0);
  analogWrite(LCLV2, 0);
  analogWrite(LCLV3, 0);
  analogWrite(LCLV4, 0);

  // wait for USB Serial
  while (!Serial) {}
  
  // start ChibiOS
  chBegin(mainThread);
  
  // should not return
  while(1);
}
//------------------------------------------------------------------------------
// main thread runs at NORMALPRIO
void mainThread() {

  // start blink thread
  chThdCreateStatic(waThread1, sizeof(waThread1), NORMALPRIO+1, Thread1, NULL);
    
  // start count thread
  chThdCreateStatic(waThread2, sizeof(waThread2), NORMALPRIO, Thread2, NULL);

    // start count thread
  //chThdCreateStatic(waThread3, sizeof(waThread3), NORMALPRIO, Thread3, NULL);

/*
  while (1) {
    //Main thread task
    //analogWrite(LCLV1, valOpacityLevel);
    //analogWrite(LCLV2, valOpacityLevel);
    //analogWrite(LCLV3, valOpacityLevel);
    //analogWrite(LCLV4, valOpacityLevel);
    
    // allow other threads to run for 1 sec
    //chThdSleepMilliseconds(1000);
  }
 */
}
//------------------------------------------------------------------------------
void loop() {/* not used */}


