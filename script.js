// Get the game container and clear button elements from the DOM
const gameContainer = document.getElementById("game");
const clear = document.getElementById("clear");

// Add event listener to clear button to clear localStorage when clicked
clear.addEventListener('click', function(){localStorage.clear()})

// Get the show button element from the DOM and add event listener to display
// a player's scores stored in localStorage in an alert when clicked
const show = document.getElementById("show"); 
show.addEventListener('click', function(){
  let scoreData = localStorage.getItem("memScores");
  let scoreArray = JSON.parse(scoreData);
  let output = '';
  for (let i = 0; i < scoreArray.length; i++) {
      let rank = i + 1;
      let initials = scoreArray[i].initials.toUpperCase();
      let score = scoreArray[i].score;
      output += rank + 'st: ' + initials + ' score: ' + score + '\n';
  }
  alert(output);
})

// Array of colors to be used for creating cards
const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple", 
  "red",
  "blue",
  "green",
  "orange",
  "purple", 
];

// Array to store hexadecimal colors (populated dynamically in the future)
let HEX = [];

// Helper function to shuffle an array (Fisher-Yates algorithm)
function shuffle(array) {
  let counter = array.length;

  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

// Shuffle the arrays of colors and hex colors
let shuffledColors = shuffle(COLORS);
// let shuffledHex = shuffle(HEX); 

// Function to create and add the cards to the game container
function createDivsForColors(colorArray) { 
  for (let color of colorArray) {
    // create a new div with the color class
    const newDiv = document.createElement("div");
    newDiv.classList.add(color, 'card');

    // add event listener to div for handling card clicks
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the game container
    gameContainer.append(newDiv);
  }
}

// Variables for tracking the game state
let firstCard = null;
let secondCard = null;
let isClickable = true;
let matchedPairs = 0;
let score = 0;
let totalPairs = 0;

// Function for handling clicks on cards
function handleCardClick(event) {  
  if (!isClickable) {
    return;
  }

  isClickable = false;
  const selectedCard = event.target;

  if (!firstCard) {
    // First card clicked
    firstCard = selectedCard;
    firstCard.style.backgroundColor = firstCard.classList[0];

    // Set timeout to make the card clickable again after 300ms
    setTimeout(function () {
      isClickable = true;
    }, 300);

    return;
  } else if (selectedCard === firstCard) {
    // Same card clicked twice, do nothing
    isClickable = true;
    return;
  }

  // Second card clicked
  secondCard = selectedCard;
  secondCard.style.backgroundColor = secondCard.classList[0];

  // Check if the cards match
  if (firstCard.classList[0] === secondCard.classList[0]) {
    // Cards match, keep them revealed and reset the variables
    firstCard = null
    secondCard = null;
    isClickable = true;
    matchedPairs++;
    score += 2;

    checkForWin()
    // check for win
    return;
  }

  // cards do not match, hide them after 1000ms and reset
  setTimeout(function () {
    firstCard.style.backgroundColor = "white";
    secondCard.style.backgroundColor = "white";
    firstCard = null;
    secondCard = null;
    isClickable = true;
    score -= 1;
  }, 1000);
} 

// when the DOM loads
createDivsForColors(shuffledColors); 

const standard = document.querySelector('#standard');
const random = document.querySelector('#random'); 

// add event listeners to the standard and random elements
standard.addEventListener('click', function(){
  gamePrep(); // prepare the game by hiding elements and resetting variables
  totalPairs = COLORS.length / 2; // set the total number of pairs in the game 
  createDivsForColors(shuffledColors); // create the game board
})

random.addEventListener('click', function(){  
  gamePrep(); 
  populateHEX();  
  // If user has second thoughts and clicks out of the prompt, reset the start page.
  if (HEX[0] == null){
    standard.classList.remove('hidden'); 
    random.classList.remove('hidden'); 
    clear.classList.remove('hidden');
    show.classList.remove('hidden'); 
  }
  totalPairs = HEX.length / 2;   
  let shuffledHex = shuffle(HEX); 
  createDivsForColors(shuffledHex);  
  HEX = [];
})
 
// prepare the game by hiding elements and resetting variables
function gamePrep(){   
  standard.classList.add('hidden');
  random.classList.add('hidden');
  clear.classList.add('hidden');
  show.classList.add('hidden');  
  game.classList.remove('hidden');
  game.innerHTML = '';
  score = 0;
  matchedPairs = 0;
  totalPairs = 0;   
}

// check if the game is complete
function checkForWin(){
if (matchedPairs === totalPairs) { 
  setTimeout(function () { 
    alert("Game Complete! Your score is: " + score);
    memScores();
    standard.classList.remove('hidden'); 
    random.classList.remove('hidden'); 
    clear.classList.remove('hidden');
    show.classList.remove('hidden'); 
    game.classList.add('hidden');
  }, 500);
}}
 
// update and display the high scores
function memScores() {   
  // Check if memScores is in localStorage, if not create it with an empty array
  const memScores = JSON.parse(localStorage.getItem("memScores")) || [];

  // If there are already 5 scores, and this latest score is not higher, do nothing
  if (memScores.length === 5 && score <= memScores[4].score) {
    return;
  }

  // If there are already 5 scores, and this latest score is higher, remove the lowest score
  if (memScores.length === 5) {
    memScores.pop();
  }

  // Prompt the user for their initials, reprompting if they enter invalid characters
  let initials = "";
  while (initials.length < 1 || initials.length > 4 || !/^[a-zA-Z]*$/.test(initials)) {
    initials = prompt("Enter your initials (letters only, up to 4 characters):");
    if (!initials) {
      // User clicked cancel or entered an empty string
      return;
    }
    initials = initials.toUpperCase().substring(0, 4);
  }

  // Add the new score to memScores
  memScores.push({ initials, score });

  // Sort memScores in descending order by score
  memScores.sort((a, b) => b.score - a.score);

  // Save memScores back to localStorage
  localStorage.setItem("memScores", JSON.stringify(memScores));
 
  // Alert the user their score and the top 5 scores
  const message = `Game complete! Your score is: ${score}\n\nTop 5 Scores:\n`;
  const topScores = memScores.map((s, i) => `${i+1}. ${s.initials}: ${s.score}`).join("\n");
  alert(message + topScores);
}

// Prompt the user for the number of colors to use in the game.
// If the user enters an invalid number, they will be reprompted.
// Use chroma.js to generate unique hex codes for each color.
// Check if each new color is unique enough from all previous colors before adding to the array.

function populateHEX(){  
const numColors = parseInt(prompt("Choose a number between 2 and 32: "));


for (let i = 0; i < numColors; i++) {
  let color;
  do {
    color = chroma.random().hex();
  } while (HEX.includes(color) || !isColorDifferentEnough(color, HEX));
  HEX.push(color);
  HEX.push(color);
}

// Check if a new color is different enough from all previous colors.
// Use chroma.deltaE to determine the difference between colors.
// A minimum difference of 20 is required between each color.
function isColorDifferentEnough(color, otherColors) {
  const minDiff = 20;
  for (let i = 0; i < otherColors.length; i++) {
    const diff = chroma.deltaE(color, otherColors[i]);
    if (diff < minDiff) {
      return false;
    }
  }
  return true;
} 
}
  
 