/*
 * IDB Programming: A3 — a musical instrument
 *
 * All of the code for your instrument goes in this file. It's split into sections:
 *   settings — the "fixed" parts of your program
 *   state    — the parts of your program that change over time
 *   sound    — the Tone.js instruments and effects
 *   update   — updates the state every 100ms, if necessary
 *   use      — uses the state to make sound and shapes every 100ms, if necessary
 *   controls — what happens when the player uses the pointer
 *   setup    — starts everything
 *
 * The pointer events change the state. update() and use() each run every
 * 100ms, in a loop:
 *   1. update: change the state, e.g. based on time or on the pointer's movement
 *   2. use:    make sound and move shapes, based on the state
 *
 * Shapes come from shape.js: createShape() makes one, and its methods
 * (setPosition, setSize, setColour ...) change it.
 *
 * Tone.js documentation: https://tonejs.github.io/docs/15.1.22/
 */

import { createShape } from "./shape.js";

// ---------- Settings ----------
// Settings variables should contain all of the "fixed" parts of your programs
// For example: which notes you can play, how fast things move, the tempo.


const melody = [
  "E4", "G4", "B4", "G4",
  "D4", "G4", "A4", "B4",
  "E4", "G4", "B4", "D5",
  "B4", "A4", "G4", "E4"
];

const donut = createShape();
const pinkglaze = createShape();
const hole = createShape();

const sprinkle1 = createShape();
const sprinkle2 = createShape();
const sprinkle3 = createShape();
const sprinkle4 = createShape();
const sprinkle5 = createShape();
const sprinkle6 = createShape();
const sprinkle7 = createShape();

const bite1 = createShape();
const bite2 = createShape();

const bite1TargetX = 0.45;
const bite2TargetX = 0.45;

// ---------- State ----------
// State variables are the parts of your program that change over time.
// For example: where the pointer is, how fast it's moving, or whether a drone is on.
let i = 0;
let duration = "8n";
let melodyLoop; // undefined (empty) so melodyLoop is not true
let lastX = 0;
let lastY = 0;
let lastTime = 0;
let melodySpeed;
let bitesMoving = true;
let bite1X = 0.75;
let bite2X = 0.8;
let pointerInsideBite = false;
let getBigger = 190;
let speeds = [];

// ---------- Sound ----------
// Make the instruments and plug them into the speakers.
const synth = new Tone.PolySynth(Tone.Synth).toDestination(); // can play several notes at once

// ---------- Update ----------
// Update the state. This is called every 100ms.
function update() {
  if (melodyLoop && bitesMoving) {
    bite1X += (bite1TargetX - bite1X) * 0.1; // bite1TargetX - bite1X calculates how far the circle is from its target and * 0.1 takes a small step towards it
    bite2X += (bite2TargetX - bite2X) * 0.1;
    bite1.setPosition(bite1X, 0.3);
    bite2.setPosition(bite1X, 0.5);
  } else {
    bite1X;
    bite2X;
  }
  setTimeout(update, 100); // call update() again in 100 milliseconds
}

// ---------- Use ----------
// Use the state to make sound and move shapes. This is called every 100ms.
 function use() {
  setTimeout(use, 100); // call use() again in 100 milliseconds
}

// ---------- Controls (Event Handlers) ----------
// Runs every time the pointer goes down: a click, a tap or a pen touch.
function startSound(event) {
  Tone.start(); // browsers only allow sound after the player has pressed something
}

function pointerEnter(event) {
 }

function pointerLeave(event) {
}

function playMelody(event){
   synth.volume.value = -20;
   synth.triggerAttackRelease(melody[i], duration);
   i++; // increase value of i by 1
   if (i > melody.length) {
     i = 0; // rests the index to the beginning of the array, so melody starts again from the first note
  }
 }

function pointerDown(event) {
 if (!melodyLoop) { // not true
  melodyLoop = setInterval(playMelody, melodySpeed); // plays one note every 200 miliseconds
 }
 bitesMoving = true;
}

function pointerUp(event) {
  clearInterval(melodyLoop); // stops the loop
  melodyLoop = null;

}

function useAverage() {
  let total = 0;
  for (let i = 0; i < speeds.length; i++) {
    total = total + speeds[i];
  }
  let average = 0;
  if (speeds.length > 0) {
    average = total / speeds.length;
  }
 console.log("average is", average);

  let volume = -20 + average * 10;
  if (volume > 0) {
    volume = 0;
  }
  synth.volume.value = volume;
}

function forgetOldest() {
  speeds.shift();
  useAverage();
}

function pointerMove(event) {
  let normX = event.clientX / window.innerWidth;
  let normY = event.clientY / window.innerHeight;
  let now = Date.now();
  let distance = Math.hypot(normX - lastX, normY - lastY);
  let seconds = (now - lastTime) / 1000;
   if (seconds === 0) {
     return; // two events in the same millisecond: no time has passed, so no speed
  }
  let speed = distance / seconds;
  lastX = normX;
  lastY = normY;
  lastTime = now;

  speeds.push(speed);
  setTimeout(forgetOldest, 500);
  useAverage();

 console.log("melody speed is ", melodySpeed, "pointer speed is", speed);
   if (speed < 0.3) {
    melodySpeed = 500;
  } else if (speed < 1.0) {
    melodySpeed = 350;
  } else if (speed < 1.6) {
    melodySpeed = 200;
  } else if (speed < 2.5) {
    melodySpeed = 150;
  } else {
    melodySpeed = 80;
  }
}

function bitesgrowBigger(event) {
  pointerInsideBite = true;
    if (pointerInsideBite){
    getBigger = Math.min(getBigger + 0.3, 300); // Math.min() compares the new value with 200 and keeps whichever is smaller
    bite1.setSize(getBigger);
    bite2.setSize(getBigger);
}
}

function stopGrowing(event) {
   pointerInsideBite = false;
}

// ---------- Setup ----------
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  update(); // start the update loop
  use(); // start the use loop

  // Example: a shape near the middle of the window. Replace it with your own.

  donut.setSize(600);
  donut.setRoundedness(1);
  donut.setColour(380, 30, 80); // skin colour
  donut.setPosition(0.1, 0.1);

  pinkglaze.setSize(530);
  pinkglaze.setRoundedness(1);
  pinkglaze.setColour(314, 40, 90); // pink colour
  pinkglaze.setPosition(0.125, 0.15);

  hole.setSize(190);
  hole.setRoundedness(1);
  hole.setColour(380, 30, 100); // white colour
  hole.setPosition(0.26, 0.4);

  sprinkle1.setSize(30);
  sprinkle1.setRoundedness(1);
  sprinkle1.setColour(324, 80, 50);
  sprinkle1.setPosition(0.4, 0.7);

  sprinkle2.setSize(25);
  sprinkle2.setRoundedness(1);
  sprinkle2.setColour(22, 80, 60);
  sprinkle2.setPosition(0.3, 0.3);

  sprinkle3.setSize(30);
  sprinkle3.setRoundedness(1);
  sprinkle3.setColour(360, 80, 50);
  sprinkle3.setPosition(0.18, 0.55);

  sprinkle4.setSize(25);
  sprinkle4.setRoundedness(1);
  sprinkle4.setColour(276, 80, 50);
  sprinkle4.setPosition(0.2, 0.3);

  sprinkle5.setSize(28);
  sprinkle5.setRoundedness(1);
  sprinkle5.setColour(162, 80, 40);
  sprinkle5.setPosition(0.25, 0.8);

  sprinkle6.setSize(23);
  sprinkle6.setRoundedness(1);
  sprinkle6.setColour(62, 80, 50);
  sprinkle6.setPosition(0.5, 0.5);

  sprinkle7.setSize(30);
  sprinkle7.setRoundedness(1);
  sprinkle7.setColour(205, 80, 50);
  sprinkle7.setPosition(0.43, 0.26);

  bite1.setSize(190);
  bite1.setRoundedness(1);
  bite1.setColour(380, 30, 100); // white colour
  bite1.setPosition(0.75, 0.3);

  bite2.setSize(190);
  bite2.setRoundedness(1);
  bite2.setColour(380, 30, 100); // white colour
  bite2.setPosition(0.8, 0.5);


  // Put your event listener code here
  donut.element.addEventListener("pointerenter", pointerEnter);
  donut.element.addEventListener("pointerleave", pointerLeave);
  pinkglaze.element.addEventListener("pointerdown", pointerDown); // plays the melody in a loop
  pinkglaze.element.addEventListener("pointerdown", playMelody); // plays the melody
  pinkglaze.element.addEventListener("pointerup", pointerUp); // stops the loop
  pinkglaze.element.addEventListener("pointermove", pointerMove);

  bite1.element.addEventListener("pointermove", bitesgrowBigger);
  bite2.element.addEventListener("pointermove", bitesgrowBigger);

  bite1.element.addEventListener("pointerleave", stopGrowing);
  bite2.element.addEventListener("pointerleave", stopGrowing);


}

setup(); // Always remember to call setup()!
