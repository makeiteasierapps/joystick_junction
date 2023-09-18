import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { db, auth } from "./firebaseConfig.js";

window.onload = function () {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const docRef = doc(db, "users", user.uid);
      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          const username = docSnap.data().username;
          document.getElementById(
            "user-greeting"
          ).textContent = `Hello, ${username}!`;
        } else {
          console.log("No such document!");
        }
      });
    } else {
      // User is signed out
      console.log("No user is signed in.");
    }
  });
};

const cells = document.querySelectorAll('[data-cell]');
const status = document.getElementById('status');
const resetButton = document.getElementById('reset-button');

let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

function checkWinner() {
  const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
  ];

  for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          // Player wins
          updateStatistics("win");
          return board[a];
      }
  }

  if (board.includes('')) {
      return null; // Game still ongoing
  } else {
      // It's a tie
      updateStatistics("tie");
      return 'T';
  }
}


function handleCellClick(e) {
    const cell = e.target;
    const cellIndex = cell.getAttribute('data-cell');

    if (board[cellIndex] === '' && gameActive) {
        board[cellIndex] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer);
        
        const winner = checkWinner();
        if (winner) {
            if (winner === 'T') {
                status.textContent = "It's a tie!";
            } else {
                status.textContent = `Player ${winner} wins!`;
            }
            gameActive = false;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            status.textContent = `Player ${currentPlayer}'s turn`;
        }
    }
}

function handleResetClick() {
    currentPlayer = 'X';
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    status.textContent = "Player X's turn";
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('X', 'O');
    });
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', handleResetClick);

handleResetClick(); // Initialize the game


let gamesPlayed = 0;
let wins = 0;
let losses = 0;
let ties = 0;

function updateStatistics(outcome) {
  gamesPlayed++;
  if (outcome === "win") {
    wins++;
  } else if (outcome === "loss") {
    losses++;
  } else if (outcome === "tie") {
    ties++;
  }

  document.getElementById("games-played").textContent = gamesPlayed.toString();
  document.getElementById("wins").textContent = wins.toString();
  document.getElementById("losses").textContent = losses.toString();
  document.getElementById("ties").textContent = ties.toString();
}

const playNowButton = document.getElementById("playNowButton");
playNowButton.addEventListener("click", function () {
  const selectedGame = prompt(
    "Which game would you like to play? (e.g. Tic Tac Toe)"
  );

  if (selectedGame && selectedGame.toLowerCase() === "tic tac toe") {
    // If the user chooses Tic Tac Toe, show the rules
    alert(
      "Rules for Tic Tac Toe:\n\nTwo players take turns marking a square. The player who succeeds in placing three of their marks in a horizontal, vertical, or diagonal row wins the game."
    );
  } else {
    // Handle other game choices (if any)
    alert("Sorry, that game is not available at the moment.");
  }
});

