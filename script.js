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

const startNotes = [
  {note: "C4", duration: "8n"},
  {note: "E4", duration: "8n"},
  {note: "G4",duration: "16n"},
  {note: "C5", duration: "16n"}
];
const stopNotes = [
   {note: "C5", duration: "8n"},
  {note: "G4", duration: "8n"},
  {note: "E4",duration: "16n"},
  {note: "C4", duration: "16n"}
];
const melody = [
  "E4", "G4", "B4", "G4",
  "D4", "G4", "A4", "B4",
  "E4", "G4", "B4", "D5",
  "B4", "A4", "G4", "E4"
];

// ---------- State ----------
// State variables are the parts of your program that change over time.
// For example: where the pointer is, how fast it's moving, or whether a drone is on.

const circle1 = createShape();
const circle2 = createShape();
const circle3 = createShape();

let i = 0;
let duration = "8n";
let melodyLoop; // undefined (empty) so melodyLoop is not true
let lastX = 0;
let lastY = 0;
let lastTime = 0;
let melodySpeed;
let speeds = [];

// ---------- Sound ----------
// Make the instruments and plug them into the speakers.
const synth = new Tone.PolySynth(Tone.Synth).toDestination(); // can play several notes at once

// ---------- Update ----------
// Update the state. This is called every 100ms.
function update() {
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
 for (let i = 0; i < startNotes.length; i++) {
  synth.triggerAttackRelease(
    startNotes[i].note,
    startNotes[i].duration,
    Tone.now() + i * 0.1
   );
  }
 }

function pointerLeave(event) {
  for (let i = 0; i < stopNotes.length; i++) {
  synth.triggerAttackRelease(
    stopNotes[i].note,
    stopNotes[i].duration,
    Tone.now() + i * 0.1
  );
 }
}

function playMelody(event){
   synth.triggerAttackRelease(melody[i], duration);
   i++; // increase value of i by 1
   if (i > melody.length) {
     i = 0; // rests the index to the beginning of the array, so melody starts again from the first note
  }
 }

function pointerDown(event) {
 if (!melodyLoop) { // not true
  melodyLoop = setInterval(playMelody, 200); // plays one note every 200 miliseconds
 }
}

function pointerUp(event) {
  clearInterval(melodyLoop); // stops the loop
  melodyLoop = null;
}


// ---------- Setup ----------
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  update(); // start the update loop
  use(); // start the use loop

  // Example: a shape near the middle of the window. Replace it with your own.

  circle1.setSize(600);
  circle1.setRoundedness(1);
  circle1.setColour(380, 30, 80); // skin colour
  circle1.setPosition(0.1, 0.1);

  circle2.setSize(530);
  circle2.setRoundedness(1);
  circle2.setColour(314, 40, 90); // pink colour
  circle2.setPosition(0.125, 0.15);

  circle3.setSize(190);
  circle3.setRoundedness(1);
  circle3.setColour(380, 30, 100); // white colour
  circle3.setPosition(0.25, 0.4);

  // Put your event listener code here
  circle2.element.addEventListener("pointerenter", pointerEnter);
  circle2.element.addEventListener("pointerleave", pointerLeave);
  circle2.element.addEventListener("pointerdown", pointerDown);
  circle2.element.addEventListener("pointerdown", playMelody);
  circle2.element.addEventListener("pointerup", pointerUp);
}

setup(); // Always remember to call setup()!
