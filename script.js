// global constants
const clueHoldTime = 1000; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global Variables
var pattern = [2, 2, 4, 3, 2, 1, 2, 4]//[3,2,1,2,3,3,3,2,2,2,4,4,4,3,2,1,2,3,3,3,2,2,3,2,1]; // 25 elements "Mary had a Little Lamb"
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5; //must be between 0.0 and 1.0
var guessCounter = 0;

function startGame(){
  //initialize game variables
  progress = 0;
  gamePlaying = true;
  //swap the Start and Stop button
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}
function stopGame(){
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}
function loseGame(){
  stopGame();
  alert("Game Over. You Lost.");
}
function winGame(){
  stopGame();
  alert("YOU WIN!");
}

//Clues functions
const lightButton = (btn) =>{
  document.getElementById("button_"+btn).classList.add("lit"); //lit is a CSS class
}
const clearButton = (btn) =>{
  document.getElementById("button_"+btn).classList.remove("lit");
}

const playSingleClue = (btn) =>{
  if(gamePlaying){
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn); //param1 = function to be called, param2= length of time in miliseconds, param3 = argument for param1 function
  }
}

function playClueSequence(){
  guessCounter = 0;
  let delay = nextClueWaitTime;
  for(let i=0; i <=progress; i++){ //this is ran summation of i from 0 to 25 times = 325x (depending on pattern.length)
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i])
    //we're adding to delay because it's to efficiently schedule each individual clue
    //think of it as a Timeline
    delay += clueHoldTime
    delay += cluePauseTime;
  }
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  
  if(pattern[guessCounter] == btn){
    if(guessCounter == progress){
      if(progress == pattern.length-1){
        winGame();
        return;
      }
      else{
        progress++;
        playClueSequence();
        return;
      } 
    }
    if(guessCounter != progress){
      guessCounter++;
    }
  }
  else{
    loseGame();
    return;
  }
}

// Sound Synthesis Functions
const freqMap = {
  1: 560,
  2: 640,
  3: 720,
  4: 800
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){ //"btn" is an index for the frequency in "freqMap"
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)