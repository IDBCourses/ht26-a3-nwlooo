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

// makes shapes on the screen
const donut = createShape();
const glaze = createShape();
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
// this is where the bites would slide to across the screen
// in pixels
const bite1TargetX = 535;
const bite2TargetX = 535;

// ---------- State ----------
// State variables are the parts of your program that change over time.
// For example: where the pointer is, how fast it's moving, or whether a drone is on.

let i = 0; // first note in the melody
let duration = "8n"; // duration each note rings for
let melodyLoop; // undefined as no value assigned yet (empty)
let lastX = 0; // stores previous horizontal position of the pointer
let lastY = 0; // stores previous vertical position of the pointer
let lastTime = 0; // stores previous recorded time of the pointer movement
let melodySpeed = 500; // delay between notes in milliseconds
// bites current size and position in pixels
let bite1StartX = 909;
let bite2StartX = 971;
let biteSize = 190;
let average = 0; // stores average pointer speed
let speeds = []; // stores recent pointer speeds

// ---------- Sound ----------
// Make the instruments and plug them into the speakers.
const synth = new Tone.PolySynth(Tone.Synth).toDestination(); // can play several notes at once
 synth.volume.value = -20; // makes the volume fairly quiet

// ---------- Update ----------
// moving the bites
function update() {
  if (melodyLoop) {
    bite1StartX += (bite1TargetX - bite1StartX) * 0.1;
    bite2StartX += (bite2TargetX - bite2StartX) * 0.1;
  // difference calculates how far the circle is from its target
  // and * 0.1 takes a small step towards it
    bite1.setPosition(bite1StartX / window.innerWidth, 197 / window.innerHeight);
    bite2.setPosition(bite2StartX / window.innerWidth, 333 / window.innerHeight);
  // divinding by window.innerWidth/Height converts positions into a fraction of the screen
  // 0-1 values (normalised) so the numbers mean the same thing on any window
  } else if (!melodyLoop) {
    bite1StartX = 909;
    bite2StartX = 971;
  }
  setTimeout(update, 100); // call update() again in 100ms
}

// ---------- Use ----------
// every 500ms use() throws away old pointer speeds and recalculates the volume and tempo
 function use() { // call use() again in 500 millisecond
  forgetOldest(); // drop old speeds
  useAverage(); // recalculates the volume and melpdy speed
  setTimeout(use, 500); // call use() again in 500ms
 }

// ---------- Controls (Event Handlers) --------
function playMelody(){
 synth.triggerAttackRelease(melody[i], duration); // starts the note and stops it after the duration
   i++; // increases value of i by 1 (moves on to the next note)
   if (i >= melody.length) { // when reaches the end of the list
     i = 0; // the array resets and starts from 0 again (melody repeats)
  }
 }
// plays one note then schedules itself to play again after 'melodySpeed' milliseconds
// reads melodySpeed fresh each time so if speed changes, the next note follows the new melodySpeed
 function loopStep() {
  playMelody();
  melodyLoop = setTimeout(loopStep, melodySpeed);
 }
// starts the loop with pointer down but only if it is not already running
function melodyStarts(event) {
 if (!melodyLoop) { // not playing yet
  loopStep(); // start the chain
 }
}
// stops the loop with pointer up
function melodyStops(event) {
  clearTimeout(melodyLoop); // cancels the scheduled next note so the chain breaks
  melodyLoop = null; // nothing is playing now
}

function forgetOldest() {
  let now = Date.now(); // gives current time in milliseconds
  // removes speed older than 500ms from the front of the array while the list is not empty
  while (speeds.length > 0 && (now - speeds[0].time) > 500) {
   speeds.shift();
  }
}
// turns average into speed settings
function useAverage() {
  let total = 0;
  for (let i = 0; i < speeds.length; i++) {
    total = total + speeds[i].speed; // adds every speed in the array
  }
  if (speeds.length > 0) {
    average = total / speeds.length;
  } else {
    average = 0; // array is empty
  }
  // console.log("average", average);
  // change the volume from quiet volume to loud volume as average increases
  let volume = -30 + average * 10;
  if (volume > 0) {
    volume = 0; // loud volume
  }
  synth.volume.value = volume;

  if (average < 1.0) {
    melodySpeed = 500;
  } else if (average < 2.0) {
    melodySpeed = 400;
  } else if (average < 3.0) {
    melodySpeed = 300;
  } else if (average < 4.0) {
    melodySpeed = 120;
  } else {
    melodySpeed = 80;
  }
}

function pointerMove(event) {
  // normalised x and y values of the pointer so the numbers mean the same thing on any window
  let normX = event.clientX / window.innerWidth;
  let normY = event.clientY / window.innerHeight;
  let now = Date.now(); // current time in ms
  let distance = Math.hypot(normX - lastX, normY - lastY); // calculate the straight-line distance
  // between where the pointer was and where it is now
  let seconds = (now - lastTime) / 1000; // (now - lastTime) calculates how much time has passed since the previous movement was recorded
 // console.log("seconds", seconds, "distance", distance);
  if (seconds === 0) { // if no time has passed, the function stops early
  //  to avoid dviding distance by zero
    return;
  }
  let speed = distance / seconds; // measured on every pointer movement

  lastX = normX;
  lastY = normY;
  lastTime = now;

  speeds.push({speed: speed, time: now }); // adds current time and speed to the speeds[]
  useAverage(); // and immediately calls useAverage function to add all speeds together
}
// move the pointer on the glaze so the bites get bigger
function bitesgrowBigger(event) {
    biteSize = Math.min(biteSize + 0.3, 320); // never goes above 320
    bite1.setSize(biteSize);
    bite2.setSize(biteSize);
  }
// move the pointer on the hole sp the bites get smaller/shrink
function bitesgetSmaller(event) {
    biteSize = Math.max(biteSize - 0.3, 190); // never goes below 190
    bite1.setSize(biteSize);
    bite2.setSize(biteSize);
  }

// ---------- Setup ----------
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  console.log("Width: " + window.innerWidth + "px, Height: " + window.innerHeight + "px");
  update(); // start the update loop
  use(); // start the use loop
 // Example: a shape near the middle of the window. Replace it with your own.

 // big beige circle
  donut.setSize(600);
  donut.setRoundedness(1);
  donut.setColour(380, 30, 80);
  donut.setPosition(100 / window.innerWidth, 60 / window.innerHeight);
 // smaller brown circle
  glaze.setSize(530);
  glaze.setRoundedness(1);
  glaze.setColour(380, 40, 20);
  glaze.setPosition(134 / window.innerWidth, 95 / window.innerHeight);
 // white circle in the middle
  hole.setSize(190);
  hole.setRoundedness(1);
  hole.setColour(380, 30, 100);
  hole.setPosition(303 / window.innerWidth, 265 / window.innerHeight);
 // pink sprinkle
  sprinkle1.setSize(30);
  sprinkle1.setRoundedness(1);
  sprinkle1.setColour(324, 80, 50);
  sprinkle1.setPosition(473 / window.innerWidth, 470 / window.innerHeight);
 // orange sprinkle
  sprinkle2.setSize(25);
  sprinkle2.setRoundedness(1);
  sprinkle2.setColour(22, 80, 60);
  sprinkle2.setPosition(349 / window.innerWidth, 197 / window.innerHeight);
 // red sprinkle
  sprinkle3.setSize(30);
  sprinkle3.setRoundedness(1);
  sprinkle3.setColour(360, 80, 50);
  sprinkle3.setPosition(200 / window.innerWidth, 367 / window.innerHeight);
 // purple sprinkle
  sprinkle4.setSize(25);
  sprinkle4.setRoundedness(1);
  sprinkle4.setColour(276, 80, 50);
  sprinkle4.setPosition(224 / window.innerWidth, 197 / window.innerHeight);
 // green sprinkle
  sprinkle5.setSize(28);
  sprinkle5.setRoundedness(1);
  sprinkle5.setColour(162, 80, 40);
  sprinkle5.setPosition(287 / window.innerWidth, 538 / window.innerHeight);
 // yellow sprinkle
  sprinkle6.setSize(23);
  sprinkle6.setRoundedness(1);
  sprinkle6.setColour(62, 80, 50);
  sprinkle6.setPosition(598 / window.innerWidth, 333 / window.innerHeight);
 // blue sprinkle
  sprinkle7.setSize(30);
  sprinkle7.setRoundedness(1);
  sprinkle7.setColour(205, 80, 50);
  sprinkle7.setPosition(511 / window.innerWidth, 169 / window.innerHeight);
 // white circle
  bite1.setSize(190);
  bite1.setRoundedness(1);
  bite1.setColour(380, 30, 100);
  bite1.setPosition(909 / window.innerWidth, 197 / window.innerHeight);
 // white circle
  bite2.setSize(190);
  bite2.setRoundedness(1);
  bite2.setColour(380, 30, 100);
  bite2.setPosition(971 / window.innerWidth, 333 / window.innerHeight);

  // Put your event listener code here
  donut.element.addEventListener("pointerleave", ()=> {
    glaze.setColour(380, 40, 20); // pink colour
  });
  glaze.element.addEventListener("pointerdown", melodyStarts); // plays the melody
  window.addEventListener("pointerup", melodyStops); // stops the melody
  glaze.element.addEventListener("pointermove", pointerMove);
  glaze.element.addEventListener("pointermove", bitesgrowBigger);
  hole.element.addEventListener("pointermove", bitesgetSmaller);

  sprinkle1.element.addEventListener("pointerdown", () => {
    glaze.setColour(315, 40, 90); // pink
  });
  sprinkle6.element.addEventListener("pointerdown", () => {
    glaze.setColour(62, 40, 80); // yellow
  });
  sprinkle2.element.addEventListener("pointerdown", () => {
    glaze.setColour(22, 70, 70); // orange
  });
  sprinkle7.element.addEventListener("pointerdown", () => {
    glaze.setColour(205, 80, 90); // blue
  });
  sprinkle4.element.addEventListener("pointerdown", () => {
    glaze.setColour(276, 80, 90); // purple
  });
  sprinkle5.element.addEventListener("pointerdown", () => {
    glaze.setColour(163, 50, 90); // green
  });
   sprinkle3.element.addEventListener("pointerdown", () => {
    glaze.setColour(360, 80, 90); // red
  });
}

setup(); // Always remember to call setup()!
