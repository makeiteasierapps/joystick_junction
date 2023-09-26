import { auth } from './firebaseConfig.js';

window.onload = function () {
    auth.onAuthStateChanged(async function (user) {
        if (user) {
            // User is signed in.
            const idToken = await user.getIdToken();

            try {
                const response = await fetch('http://localhost:5000/user', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: idToken,
                    },
                });

                const data = await response.json();
                if (data) {
                    const username = data.username;
                    document.getElementById(
                        'user-greeting'
                    ).textContent = `Hello, ${username}!`;
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            // No user is signed in.
            console.log('No user is signed in.');
        }
    });
};

document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const resetButton = document.querySelector('.reset-button');
    let currentPlayer = 'X';

    //Function to display the status of whose turn it is.
    function updateStatus() {
        status.textContent = `Player ${currentPlayer}'s turn`;
    }

    //Game reset-function
    function handleResetClick() {
        currentPlayer = 'X';
        cells.forEach((cell) => {
            cell.textContent = '';
            cell.classList.remove('X', 'O');
        });
        updateStatus(); // Update the status after resetting the game
    }

    resetButton.addEventListener('click', handleResetClick);

    cells.forEach((cell) => {
        cell.addEventListener('click', (e) => {
            // If the clicked cell is empty:
            if (e.target.textContent == '') {
                // Place the current player's mark (X or O) in the cell.
                e.target.textContent = currentPlayer;
                // send to firebase

                // Check if the current move resulted in a win.
                if (checkWinner()) {
                    setTimeout(() => {
                        alert(currentPlayer + ' won this round!');
                        location.reload(); // Reload the game.
                    }, 100);
                }
                // If not a win, check if the game is a tie.
                else if (isTie()) {
                    setTimeout(() => {
                        alert("It's a tie!");
                        location.reload(); // Reload the game.
                    }, 100); // schedules a function to run after a delay ensuring that the last move is visually rendered on the screen before the alert pops up
                }
                // If not a win and not a tie, switch to the other player.
                else {
                    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                    updateStatus(); // Update the status after switching player
                }
            }
        });
    });

    // Function to check if there's a winning combination on the board.
    function checkWinner() {
        // List of all potential winning combinations in tic-tac-toe.
        const winCombination = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        // Loop through each potential winning combination.
        for (const combination of winCombination) {
            // If all cells in a combination have the same non-empty value, return true (indicating a win).
            if (
                cells[combination[0]].textContent !== '' && //Checks if the first cell is not empty
                cells[combination[0]].textContent ===
                    cells[combination[1]].textContent && // If the content of the first cell is the same as the content of the second cell in the current combination.
                cells[combination[1]].textContent ===
                    cells[combination[2]].textContent // checks if the content of the second cell is the same as the content of the third cell in our combination.
            ) {
                return true;
            }
        }
        return false; // If no winning combination found, return false.
    }

    // Function to check if all cells are filled and the game is a tie.
    function isTie() {
        // Check if every cell is filled (none are empty).
        return [...cells].every((cell) => cell.textContent !== '');
    }

    updateStatus();
});

let gamesPlayed = 0;
let wins = 0;
let losses = 0;
let ties = 0;

function updateStatistics(outcome) {
    gamesPlayed++;
    if (outcome === 'win') {
        wins++;
    } else if (outcome === 'loss') {
        losses++;
    } else if (outcome === 'tie') {
        ties++;
    }

    document.getElementById('games-played').textContent =
        gamesPlayed.toString();
    document.getElementById('wins').textContent = wins.toString();
    document.getElementById('losses').textContent = losses.toString();
    document.getElementById('ties').textContent = ties.toString();
}

const playNowButton = document.getElementById('playNowButton');
playNowButton.addEventListener('click', function () {
    const selectedGame = prompt(
        'Which game would you like to play? (e.g. Tic Tac Toe)'
    );

    if (selectedGame && selectedGame.toLowerCase() === 'tic tac toe') {
        // If the user chooses Tic Tac Toe, show the rules
        alert(
            'Rules for Tic Tac Toe:\n\nTwo players take turns marking a square. The player who succeeds in placing three of their marks in a horizontal, vertical, or diagonal row wins the game.'
        );
    } else {
        // Handle other game choices (if any)
        alert('Sorry, that game is not available at the moment.');
    }
});
