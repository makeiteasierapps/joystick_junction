/*  
    -	JoyStick Junction: Tic Tac Toe
    - Group: SHAUN | THOMAS | HAILY
    -	Tic Tac Toe Game Rules
	  -	Updated: 09/14/2023 | 1630 | Haily
*/

// Wait for the content of the document to load before executing the JavaScript.
document.addEventListener("DOMContentLoaded", () => {
  // Get all the buttons with class "cell" and store them in the cells constant.
  const cells = document.querySelectorAll(".cell");

  // Start the game with player X.
  let currentPlayer = "X";

  // Add a click event listener to each cell.
  cells.forEach((cell) => {
    cell.addEventListener("click", (e) => {
      // If the clicked cell is empty:
      if (e.target.textContent == "") {
        // Place the current player's mark (X or O) in the cell.
        e.target.textContent = currentPlayer;

        // Check if the current move resulted in a win.
        if (checkWinner()) {
          setTimeout(() => {
            alert(currentPlayer + " won this round!");
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
          currentPlayer = currentPlayer === "X" ? "O" : "X";
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
        cells[combination[0]].textContent !== "" && //Checks if the first cell is not empty
        cells[combination[0]].textContent ===
          cells[combination[1]].textContent && // If the content of the first cell is the same as the content of the second cell in the current combination.
        cells[combination[1]].textContent === cells[combination[2]].textContent // checks if the content of the second cell is the same as the content of the third cell in our combination.
      ) {
        return true;
      }
    }
    return false; // If no winning combination found, return false.
  }

  // Function to check if all cells are filled and the game is a tie.
  function isTie() {
    // Check if every cell is filled (none are empty).
    return [...cells].every((cell) => cell.textContent !== "");
  }
});
