"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */
const game = document.querySelector('#game');
const FOUND_MATCH_WAIT_MSECS = 1000;

let active = game.getElementsByClassName('faceup');
let faceUp = 0;

const scorediv = document.querySelector('#score');
let score = 0;

const lowscoretext = document.querySelector('#lowscore');
let lowscore = 0;

const restart = document.querySelector('#shuffle');

const lowscorecard = document.querySelector('#lowscorecard');

const difficultyinput = document.querySelector('#colornumber');
let difficulty = 5;



function update() {
  updatedifficulty(); //updates
  clearall(); //deletes all cards
  createcolorarray(); //creates new randomized array of colors
  createCards(colors);  //creates the cards and adds them to page
  updatescore(); //reset score variable and score on page to zero

}



// difficultyinput.addEventListener('keyup', function(e) {
//   e.preventDefault();
//   update();
//   lowscore = 0;
//   lowscoretext.innerText = score;

// });
// difficultyinput.addEventListener('click', function(e) {
//   e.preventDefault();
//   update();
//   lowscore = 0;
//   lowscoretext.innerText = score;
// });


//FUNCTIONS


//Generate Random Colors
function randomRGB() {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);
  return `rgb(${red},${green},${blue})`
}

//creat array of random colors
let colors=[];
function createcolorarray() {
  let COLORS = []
  for (let i= 0; i<difficulty; i++) {
    let currentcolor = randomRGB()
    COLORS.push(currentcolor);
    COLORS.push(currentcolor);
  }
  colors = shuffle(COLORS);
}

/** Shuffle array items in-place and return shuffled array. */
function shuffle(items) {
  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

//remove all the cards from the site
function clearall(){
  let i = 0;
  for (let i = 0; i<colors.length; i++) {
    game.children[0].remove();
  }
}

//update
function updatedifficulty() {
  difficulty = difficultyinput.value;
  return difficulty;
}

function updatescore(){
  score = 0; //reset score
  scorediv.innerText = score; // update 0 score on page
}

function updatelowscore(){
  lowscore = 0;
  lowscoretext.innerText = score;
}

//create the cards and add them to the page
function createCards(colors) {
  for (let color of colors) {
    let wipdiv = document.createElement('div');
    wipdiv.classList.add('card');
    wipdiv.classList.add(color);
    game.append(wipdiv);
  }
}

/** Flip a card face-up. */
function flipCard(evt) {
    evt.target.style.backgroundColor = evt.target.classList[1];
    evt.target.classList.add('faceup');
    faceUp = active.length;
    score ++;
    scorediv.innerText = score;
}

/** Flip a card face-down. */
function unFlipCard() {
  for (let div of game.children) {
    if (div.classList[2] === 'faceup') {
      div.style.backgroundColor = 'white';
      div.classList.remove('faceup');
      faceUp = active.length;
    }
  }
}

/** Handle clicking on a card: this could be first-card or second-card. */
function handleCardClick(evt) {

  //if the game is finished, take no action
  if (document.getElementsByClassName('found').length === colors.length) {
    return
  }
  let active = game.getElementsByClassName('faceup');
  faceUp = active.length;

  //first card
  if (faceUp === 0) {
    flipCard(evt);

  //second card (do nothing if two cards are already face up)
  } else if (faceUp === 1) {
    flipCard(evt);

    //keep face up if color class is a match
    if (active[0].classList[1] === active[1].classList[1]) {
        for (let i = 1; i>=0; i--) {
          active[i].setAttribute('class','card ' +active[0].classList[1] + ' found');
        }
        for(let each of document.getElementsByClassName('found')) {
          each.style.borderRadius = '50px';
        }

        //flip to face down if color class doesn't match
      } else {
        setTimeout(function() {
          unFlipCard();
        },1000);
      }
  }
}


//LISTENING EVENTS


//reset board and low score each time difficulty is adjusted
['keyup','click'].forEach(function(e){
  difficultyinput.addEventListener(e,function(e){
    e.preventDefault();
    update();
    updatelowscore();
  })
})


//card click
game.addEventListener('click', function(evt) {
  if (evt.target.classList[0] === 'card') {
    handleCardClick(evt);
  }
  //upon winning
  if (document.getElementsByClassName('found').length === colors.length) {

    setTimeout(function() {

    //transform 'Play Again' button
    document.querySelector('#startgame').innerText = " AGAIN!";
    restart.setAttribute('style','border-radius: 50px; background-color: rgb(99, 217, 186);');

      //if new low score then transform play button
    if (score < lowscore || lowscore === 0) {
      lowscore = score;
      lowscoretext.innerText = lowscore;
      lowscorecard.setAttribute('style','border-radius: 50px; background-color: rgb(99, 217, 186);');
    }
    },500);

    //transform play and lowscore back to default
    setTimeout(function() {
      restart.setAttribute('style',"");
      lowscorecard.setAttribute('style','');
      },4000);
  }
})

//click play again butto
restart.addEventListener('click',function (evt){
  update();
  })

//button to reveal all the tiles, helps with troubleshooting behavior after the game is finished. This button has a hidden class in CSS that should be commented out to make it usable.

cheat.addEventListener('click', function(){
  const cheat = document.querySelector('#cheat');
  for (let card of game.children) {
    card.style.backgroundColor = card.classList[1];
    card.classList.add('found');
  }
})