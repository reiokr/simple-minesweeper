document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const container = document.querySelector(".container");
  const form = document.querySelector("form");
  const input = document.querySelector("#bomb");
  const inputWidth = document.querySelector("#square");
  let marker = 0;
  let squares = [];
  let isGameOver = false;

  // how many squares
  let width =
    localStorage.getItem("rows and cols") || parseInt(inputWidth.value);
  inputWidth.value = width;

  // how many bombs?
  let bombAmount = localStorage.getItem("bombAmount") || parseInt(input.value);
  input.value = bombAmount;

  form.addEventListener("submit", bombs);

  // Show amount of bombs
  function bombs(e) {
    e.preventDefault();
    if (isGameOver) return;
    if (input.value < 1 || input.value > width * width - 1) return;
    const bombs = document.createElement("p");
    bombs.innerText = `Find all ${input.value} Bombs`;
    container.insertBefore(bombs, grid);
    form.style.display = "none";
    localStorage.setItem("bombAmount", parseInt(input.value));
    localStorage.setItem("rows and cols", parseInt(inputWidth.value));
    document.documentElement.style.setProperty(
      "--amount",
      parseInt(inputWidth.value)
    );
    if (inputWidth.value > 30) {
      document.documentElement.style.setProperty('--sq-width', 30 + "px");
    }
    grid.style.display = "flex";
    createBoard();
    startTimer();
  }

  //Create Board

  function createBoard() {
    bombAmount = parseInt(input.value);
    width = parseInt(inputWidth.value);

    // get shuffled game array with random bombs
    const bombArray = Array(bombAmount).fill("bomb");
    const emptyArray = Array(width * width - bombAmount).fill("valid");
    const gameArray = emptyArray.concat(bombArray);

    // const gameArray = [...emptyArray, ...bombArray];
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
          i > width - 1 &&
          !isRightEdge &&
          squares[i + 1 - width].classList.contains("bomb")
        )
          total++;
        if (i > width && squares[i - width].classList.contains("bomb")) total++;
        if (
          i > width + 1 &&
          !isLeftEdge &&
          squares[i - 1 - width].classList.contains("bomb")
        )
          total++;
        if (
          i < width * width - 2 &&
          !isRightEdge &&
          squares[i + 1].classList.contains("bomb")
        )
          total++;
        if (
          i < width * width - width &&
          !isLeftEdge &&
          squares[i - 1 + width].classList.contains("bomb")
        )
          total++;
        if (
          i < width * width - width - 2 &&
          !isRightEdge &&
          squares[i + 1 + width].classList.contains("bomb")
        )
          total++;
        if (
          i < width * width - width - 1 &&
          squares[i + width].classList.contains("bomb")
        )
          total++;

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
            square.style.color = "maroon";
            break;
          case 2:
            square.style.color = "blue";
            break;
          case 3:
            square.style.color = "green";
            break;
          case 4:
            square.style.color = "indigo";
            break;
          case 5:
            square.style.color = "darkviolet";
            break;
          case 6:
            square.style.color = "teal";
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
    if (
      square.classList.contains("checked") &&
      !square.classList.contains("marked")
    )
      return;
    if (
      (!square.classList.contains("checked") && marker < bombAmount) ||
      square.classList.contains("marker")
    ) {
      if (!square.classList.contains("marker")) {
        square.classList.add("marker");
        square.innerHTML = "🚩";
        marker++;
      } else {
        square.classList.remove("marker");
        square.innerHTML = "";

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
      if (currentId > width - 1 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > width) {
        const newId = squares[parseInt(currentId) - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > width * 1 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < width * width - 2 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < width * width - width && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < width * width - width - 2 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < width * width - width - 1) {
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
      bomb.innerHTML = "💣";
    });
    message("Game Over!");
    resetTimer();
  }

  // message if win or game over
  function message(msg) {
    const message = document.createElement("h1");
    message.textContent = msg;
    const newGameBtn = document.createElement("button");
    newGameBtn.classList.add("btn");
    newGameBtn.textContent = "New Game";

    container.insertBefore(message, grid.nextElementSibling);
    container.insertBefore(
      newGameBtn,
      grid.nextElementSibling.nextElementSibling
    );
    newGameBtn.addEventListener("click", () => window.location.reload());
    let bombAmount = 0;
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
    list.innerHTML += `<li>${time.b} Bombs - ${time.sq} squares  -  Time: ${time.h} : ${time.m} : ${time.s}</li>`;
  });
}

// save current time
function saveTime() {
  // add new time to list
  bombAmount = localStorage.getItem("bombAmount");
  width = localStorage.getItem("rows and cols");
  const li = document.createElement("li");
  const timerInput = document.createTextNode(
    `${bombAmount} Bombs - ${width * width} Squares  -  Time: ${
      hours.innerText
    } : ${minInput.innerText} : ${secInput.innerText}`
  );
  list.appendChild(li);
  li.appendChild(timerInput);

  // add new time to local storage
  const storedTime = {
    b: bombAmount,
    sq: width * width,
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
