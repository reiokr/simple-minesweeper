document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const container = document.querySelector(".container");
  const form = document.querySelector("form");
  const input = document.querySelector('input[type="number"]');
  let width = 10;
  let marker = 0;
  let squares = [];
  let isGameOver = false;
 
  // how many bombs?
  form.addEventListener("submit", bombs);

  // Show amount of bombs
  function bombs(e) {
    e.preventDefault();
    if (isGameOver) return;
    if (!input.value){
      input.value = 20;
    }
    if (input.value < 1 || input.value > width*width -1) return;

    const bombs = document.createElement("p");
    bombs.innerText = `Find all ${input.value} Bombs`;
    container.insertBefore(bombs, grid);
    form.style.display = "none";
    createBoard();
    startTimer();
  }

  //Create Board
  function createBoard() {
    bombAmount = parseInt(input.value);

    // get shuffled game array with random bombs
    const bombArray = Array(bombAmount).fill("bomb");
    const emptyArray = Array(width * width - bombAmount).fill("valid");
    const gameArray = emptyArray.concat(bombArray);

    // const gameArray = [...emptyArray,...bombArray]
    const suffledArray = gameArray.sort(() => Math.random() - 0.5);

    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.setAttribute("id", i);
      square.classList.add(suffledArray[i]);
      grid.appendChild(square);
      squares.push(square);

      // normal click
      square.addEventListener("click", (e) => {
        if (isGameOver) return;

        click(square);
        checkForWin();
      });

      // right click
      square.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        rightClick(square);
        checkForWin();
      });
    }

    // add numbers
    for (let i = 0; i < squares.length; i++) {
      const isLeftEdge = i % width === 0;
      const isRightEdge = i % width === width - 1;
      let total = 0;

      if (squares[i].classList.contains("valid")) {
        if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb"))
          total++;
        if (
          i > 9 &&
          !isRightEdge &&
          squares[i + 1 - width].classList.contains("bomb")
        )
          total++;
        if (i > 10 && squares[i - width].classList.contains("bomb")) total++;
        if (
          i > 11 &&
          !isLeftEdge &&
          squares[i - 1 - width].classList.contains("bomb")
        )
          total++;
        if (i < 98 && !isRightEdge && squares[i + 1].classList.contains("bomb"))
          total++;
        if (
          i < 90 &&
          !isLeftEdge &&
          squares[i - 1 + width].classList.contains("bomb")
        )
          total++;
        if (
          i < 88 &&
          !isRightEdge &&
          squares[i + 1 + width].classList.contains("bomb")
        )
          total++;
        if (i < 89 && squares[i + width].classList.contains("bomb")) total++;

        squares[i].setAttribute("data", total);
      }
    }
  }

  // click on square actions
  function click(square) {
    let currentId = square.id;

    if (isGameOver) return;
    if (
      square.classList.contains("checked") ||
      square.classList.contains("marker") ||
      square.classList.contains("blow")
    )
      return;
    if (square.classList.contains("bomb")) {
      square.style.backgroundColor = "red";
      gameOver(square);
    } else {
      let total = Number(square.getAttribute("data"));
      if (total !== 0) {
        square.classList.add("checked");
        square.innerHTML = total;
        switch (total) {
          case 1:
            square.style.color = "yellow";
            break;
          case 2:
            square.style.color = "navyblue";
            break;
          case 3:
            square.style.color = "magenta";
            break;
          case 4:
            square.style.color = "red";
            break;
          case 5:
            square.style.color = "violet";
            break;
          case 6:
            square.style.color = "blue";
            break;

          default:
            break;
        }
        return;
      }
      checkSquare(square, currentId);
    }
    square.classList.add("checked");
  }

  // right click square action
  function rightClick(square) {
    if (isGameOver) return;
    if (square.classList.contains("checked")) return;
    if (!square.classList.contains("checked") && marker < bombAmount) {
      if (!square.classList.contains("marker")) {
        square.classList.add("marker");
        marker++;
      } else {
        square.classList.remove("marker");
        marker--;
      }
    }
  }

  // check neighboring squares once square is clicked
  function checkSquare(square, currentId) {
    const isLeftEdge = currentId % width === 0;
    const isRightEdge = currentId % width === width - 1;

    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > 9 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > 10) {
        const newId = squares[parseInt(currentId) - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > 11 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 98 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 90 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 88 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 89) {
        const newId = squares[parseInt(currentId) + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
    }, 50);
  }

  // game over event
  function gameOver(square) {
    isGameOver = true;

    // show all bombs
    document.querySelectorAll(".bomb").forEach((bomb) => {
      bomb.classList.add("blow");
    });
    message("Game Over!");
    resetTimer();
  }

  // message if win or game over
  function message(msg) {
    const message = document.createElement("h1");
    message.textContent = msg;
    const newGameBtn = document.createElement("button");
    newGameBtn.classList.add('btn');
    newGameBtn.textContent = "New Game";

    container.insertBefore(message, grid.nextElementSibling);
    container.insertBefore(
      newGameBtn,
      grid.nextElementSibling.nextElementSibling
    );
    newGameBtn.addEventListener("click", () => window.location.reload());
    let bombAmount = 0
  }

  // check for win
  function checkForWin() {
    if (isGameOver) return;
    let matches = 0;
    for (let i = 0; i < squares.length; i++) {
      if (
        squares[i].classList.contains("marker") &&
        squares[i].classList.contains("bomb")
      ) {
        matches++;
      }
      if (matches === bombAmount) {
        message("You Win!");
        saveTime();
        resetTimer();
        isGameOver = true;
        break;
      }
    }
  }

  // list stored times
  getTimeFromLs();
});
//////////////////////////////////////////////////////////////////////////////////////
// game timer with local storage

let ls = JSON.parse(localStorage.getItem("time")) || [];

// get DOM elements
const msInput = document.getElementById("milliseconds");
const minInput = document.getElementById("minutes");
const secInput = document.getElementById("seconds");
const hours = document.getElementById("hours");
let list = document.querySelector('[data-type = "list"]');
const clearListBtn = document.getElementById("clear-list");
let timerTime = 000000;
let isRunning = false;
let interval;

// functions
function startTimer() {
  if (isRunning) return; // if running it preventing call interval that is running already
  isRunning = true; // set true if not running
  interval = setInterval(incrementTimer, 10);
}

// stop timer function
function stopTimer() {
  if (!isRunning) return; // if not running then return
  isRunning = false; // if running set to false and stop interval
  clearInterval(interval);
}

// reset timer function
function resetTimer() {
  stopTimer();

  timerTime = 0;
  msInput.innerText = "00";
  minInput.innerText = "00";
  secInput.innerText = "00";
  hours.innerText = "00";
}

// timer increment function
function incrementTimer() {
  timerTime++;
  const numMilliseconds = timerTime % 100;
  const numSeconds = Math.floor(timerTime / 100) % 60;
  const numMinutes = Math.floor(timerTime / 6000) % 60;
  const numHours = Math.floor(timerTime / 360000) % 24;

  minInput.innerText = pad(numMinutes);
  secInput.innerText = pad(numSeconds);
  msInput.innerText = pad(numMilliseconds);
  hours.innerText = pad(numHours);
}

// add 0 before if number is les than 10
function pad(num) {
  return num < 10 ? "0" + num : num;
}

// get time from local storage
function getTimeFromLs() {
  ls.forEach((time) => {
    list.innerHTML += `<li>${time.b} bombs - Time ${time.h}h : ${time.m}m : ${time.s}s</li>`;
  });
}

// save current time
function saveTime() {
  // add new time to list
  const li = document.createElement("li");
  const timerInput = document.createTextNode(
    `${bombAmount} bombs - Time ${hours.innerText}h : ${minInput.innerText}m : ${secInput.innerText}s`
  );
  list.appendChild(li);
  li.appendChild(timerInput);

  // add new time to local storage
  const storedTime = {
    b: bombAmount,
    h: hours.innerText,
    m: minInput.innerText,
    s: secInput.innerText,
    ms: msInput.innerText,
  };
  ls.push(storedTime);
  localStorage.setItem("time", JSON.stringify(ls));
}

// clear saved time list function
function clearList() {
  list.innerHTML = "";
  localStorage.removeItem("time");
}

// event listeners
clearListBtn.addEventListener("click", clearList);
