"use strict";

// HTML ELEMENTS
const easyButton = document.querySelector(".e-btn");
const mediumButton = document.querySelector(".m-btn");
const hardButton = document.querySelector(".h-btn");
const userName = document.querySelector(".username");
const containerDiv = document.querySelector(".container");
const mainBoard = document.querySelector(".board");
const detailsContainer = document.querySelector(".details-container");
const minesLeft = document.querySelector(".mines");
const newGame = document.querySelector(".new-game");

// STATE VARIABLES
let HEIGHT;
let WIDTH;
let NUMBER_OF_MINES;
let ZOOM;
let DIFFICULTY_SETTING;

let board = [];
let bombsArr = [];
let randomNumArr = [];

// SET STATE VARIABLES BASED ON EASY BUTTON CLICK
// FUTURE PROJECTS HAVE ALL 3 CLICKS IN ONE FUNCTION
easyButton.addEventListener("click", function () {
  HEIGHT = 8;
  WIDTH = 8;
  NUMBER_OF_MINES = 10;
  ZOOM = 100 + "%";
  DIFFICULTY_SETTING = "easy";

  setTimeout(() => {
    containerDiv.classList.add("hidden");
  }, 50);

  setTimeout(() => {
    mainBoard.classList.remove("hidden");
    minesLeft.classList.remove("hidden");
    detailsContainer.classList.remove("hidden");
  }, 50);

  initBoard(HEIGHT, WIDTH, NUMBER_OF_MINES, ZOOM);
});

// SET STATE VARIABLES BASED ON EASY BUTTON CLICK
// FUTURE PROJECTS HAVE ALL 3 CLICKS IN ONE FUNCTION
mediumButton.addEventListener("click", function () {
  HEIGHT = 20;
  WIDTH = 20;
  NUMBER_OF_MINES = 55;
  ZOOM = 85 + "%";
  DIFFICULTY_SETTING = "medium";

  setTimeout(() => {
    containerDiv.classList.add("hidden");
  }, 50);

  setTimeout(() => {
    mainBoard.classList.remove("hidden");
    minesLeft.classList.remove("hidden");
    detailsContainer.classList.remove("hidden");
  }, 50);

  initBoard(HEIGHT, WIDTH, NUMBER_OF_MINES, ZOOM);
});

// SET STATE VARIABLES BASED ON EASY BUTTON CLICK
// FUTURE PROJECTS HAVE ALL 3 CLICKS IN ONE FUNCTION
hardButton.addEventListener("click", function () {
  HEIGHT = 20;
  WIDTH = 40;
  NUMBER_OF_MINES = 210;
  ZOOM = 65 + "%";
  DIFFICULTY_SETTING = "hard";

  setTimeout(() => {
    containerDiv.classList.add("hidden");
  }, 50);

  setTimeout(() => {
    mainBoard.classList.remove("hidden");
    minesLeft.classList.remove("hidden");
    detailsContainer.classList.remove("hidden");
  }, 50);

  initBoard(HEIGHT, WIDTH, NUMBER_OF_MINES, ZOOM);
});

// INITIALIZES BOARD WITH VARIBALES PASSED IN FROM GLOBAL STATE
function initBoard(HEIGHT, WIDTH, NUMBER_OF_MINES, ZOOM) {
  let winTotal = HEIGHT * WIDTH - NUMBER_OF_MINES;
  mainBoard.style.setProperty("--height", HEIGHT);
  mainBoard.style.setProperty("--width", WIDTH);
  mainBoard.style.setProperty("--zoom", ZOOM);

  // VARIABLES
  let flagCount = 0;
  let isGameOver = false;

  // ARRAYS
  board = [];
  bombsArr = [];
  randomNumArr = [];

  validGen();
  createBoard(HEIGHT, WIDTH);
  squareCount();

  function validGen() {
    for (let x = 0; randomNumArr.length < NUMBER_OF_MINES; x++) {
      let a = Math.floor(Math.random() * HEIGHT);
      let b = Math.floor(Math.random() * WIDTH);
      let randomInt = a + "." + b;

      if (!randomNumArr.includes(randomInt)) {
        randomNumArr.push(randomInt);
      }
    }

    for (let x = 0; x < randomNumArr.length; x++) {
      const testVar = randomNumArr[x];
      const bombs = [testVar];
      bombsArr.push(bombs);
    }
  }

  //  CREATES THE BOARD BASED ON HEIGHT AND WIDTH PASSED IN FROM INIT FUNCTION

  // LOOPS OVER BOARD ON X AND Y AXIS
  function createBoard(HEIGHT, WIDTH) {
    for (let x = 0; x < HEIGHT; x++) {
      const row = [];
      for (let y = 0; y < WIDTH; y++) {
        minesLeft.innerHTML = NUMBER_OF_MINES - flagCount;
        const square = document.createElement("div");
        square.setAttribute("id", x + "." + y);
        mainBoard.appendChild(square);
        // prevents the contextmenu popping up on right click
        square.addEventListener("contextmenu", (e) => e.preventDefault());
        square.addEventListener("mousedown", function (e) {
          if (e.button == 0) {
            leftClick(square);
          } else if (e.button == 2) {
            rightClick(square);
          }
        });

        const combinedInt = x + "." + y;
        const tile = [combinedInt];

        for (let a = 0; a < bombsArr.length; a++) {
          if (combinedInt === bombsArr[a][0]) {
            if (tile[1] === "valid") {
              tile.pop("valid");
              tile.push("bomb");
            } else if (tile[1] === undefined) {
              tile.push("bomb");
            }
          } else if (tile[1] === undefined) {
            tile.push("valid");
          }
        }

        row.push(tile);
      }
      board.push(row);
    }

    for (let x = 0; x < HEIGHT; x++) {
      for (let y = 0; y < WIDTH; y++) {
        if (board[x][y].includes("bomb")) {
          const gridDiv = document.getElementById(`${x + "." + y}`);
          gridDiv.classList.add("bomb");
        } else {
          const gridDiv = document.getElementById(`${x + "." + y}`);
          gridDiv.classList.add("valid");
        }
      }
    }

    return board;
  }

  function squareCount() {
    for (let x = 0; x < HEIGHT; x++) {
      for (let y = 0; y < WIDTH; y++) {
        let count = 0;

        for (let a = x - 1; a <= x + 1; a++) {
          for (let b = y - 1; b <= y + 1; b++) {
            if (a >= 0 && b >= 0 && a < HEIGHT && b < WIDTH) {
              if (board[a][b].includes("bomb")) {
                count++;
              }
            }
          }
        }
        if (!board[x][y].includes("bomb")) {
          board[x][y].push(count);
        } else {
          // console.log(board[x][y][2]);
        }
      }
    }
    return;
  }

  function leftClick(square) {
    let coordinates = square.id;
    let coordinatesArr = coordinates.split(".");
    let x = Number(coordinatesArr[0]);
    let y = Number(coordinatesArr[1]);

    const currentBoard = board[x][y];

    const currentGridDiv = document.getElementById(`${x + "." + y}`);
    if (isGameOver === true) {
      return;
    }
    if (
      currentGridDiv.classList.contains("checked") ||
      currentGridDiv.classList.contains("isFlag")
    ) {
      return;
    }

    if (currentBoard[1] === "bomb") {
      currentGridDiv.classList.add("triggerBomb");
      gameOver();
      return;
    } else {
      let total = currentBoard[2];
      if (total != 0) {
        currentGridDiv.classList.add("checked");
        currentGridDiv.innerHTML = total;
        winTotal--;
        winGame();
        return;
      }
      checkSquare(x, y);
    }
    currentGridDiv.classList.add("checked");
    winTotal--;
    winGame();
    return;
  }

  function rightClick(square) {
    let coordinates = square.id;
    let coordinatesArr = coordinates.split(".");
    let x = coordinatesArr[0];
    let y = coordinatesArr[1];
    console.log(x, y);
    let currentGridDiv = document.getElementById(`${x + "." + y}`);

    if (isGameOver === true) {
      return;
    }
    if (currentGridDiv.classList.contains("isFlag")) {
      currentGridDiv.classList.remove("isFlag");

      flagCount--;
      minesLeft.innerHTML = NUMBER_OF_MINES - flagCount;
    } else if (
      flagCount < NUMBER_OF_MINES &&
      !currentGridDiv.classList.contains("checked")
    ) {
      currentGridDiv.classList.add("isFlag");
      flagCount++;
      minesLeft.innerHTML = NUMBER_OF_MINES - flagCount;
    }
  }

  function checkSquare(x, y) {
    for (let a = x - 1; a <= x + 1; a++) {
      for (let b = y - 1; b <= y + 1; b++) {
        if (a >= 0 && b >= 0 && a < HEIGHT && b < WIDTH) {
          {
            setTimeout(() => {
              const newSquare = document.getElementById(`${a + "." + b}`);
              leftClick(newSquare);
            }, 50);
          }
        }
      }
    }
  }

  function gameOver() {
    isGameOver = true;
    for (let x = 0; x < HEIGHT; x++) {
      for (let y = 0; y < WIDTH; y++) {
        const gridDiv = document.getElementById(`${x + "." + y}`);

        if (!board[x][y].includes("bomb")) {
          gridDiv.classList.add("checked");
          let total = board[x][y][2];
          if (total > 0) {
            gridDiv.innerHTML = total;
          }
        }
      }
    }
  }

  function winGame() {
    if (winTotal === 0) {
      for (let x = 0; x < HEIGHT; x++) {
        for (let y = 0; y < WIDTH; y++) {
          const gridDiv = document.getElementById(`${x + "." + y}`);
          if (gridDiv.classList.contains("checked")) {
            gridDiv.classList.add("golden");
          }
        }
      }
    }
    return;
  }
}

newGame.addEventListener("click", function () {
  location.reload(true);
  if (DIFFICULTY_SETTING === "easy") {
    console.log(1);
  }
});
