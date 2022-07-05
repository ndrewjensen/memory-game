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
function updatedifficulty() {
  difficulty = difficultyinput.value;
  return difficulty;
}

function update() {
  updatedifficulty();
  clearall();
  createcolorarray();
  createCards(colors);
  score = 0;
  scorediv.innerText = score;

}

//reset board and low score each time difficulty is adjusted

['keyup','click'].forEach(function(e){
  difficultyinput.addEventListener(e,function(e){
    e.preventDefault();
    update();
    lowscore = 0;
    lowscoretext.innerText = score;
  })

})

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

//Generate Random Colors
function randomRGB() {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);
  return `rgb(${red},${green},${blue})`
}

//creat array of random colors
let colors = [];

function createcolorarray() {
  let COLORS = []
  for (let i= 0; i<difficulty; i++) {
    let currentcolor = randomRGB()
    COLORS.push(currentcolor);
    COLORS.push(currentcolor);
  }
  colors = shuffle(COLORS);
}
// createcolorarray();
// createCards(colors);

//clear all cards
function clearall(){
  let i = 0;
  for (let i = 0; i<colors.length; i++) {
    game.children[0].remove();

  }
}


/** Shuffle array items in-place and return shuffled array. */
function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - a click event listener for each card to handleCardClick
 */

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
  if (document.getElementsByClassName('found').length === colors.length) {
    return
  }
  let active = game.getElementsByClassName('faceup');
  faceUp = active.length;
  if (faceUp === 0) {
    flipCard(evt);

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

game.addEventListener('click', function(evt) {
  if (evt.target.classList[0] === 'card') {
    handleCardClick(evt);
  }
  //upon winning
  if (document.getElementsByClassName('found').length === colors.length) {

    setTimeout(function() {

    //transform Play again button
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

restart.addEventListener('click',function (evt){
  update();
  })


const cheat = document.querySelector('#cheat');
cheat.addEventListener('click', function(){
  for (let card of game.children) {
    card.style.backgroundColor = card.classList[1];
    card.classList.add('found');
  }
})