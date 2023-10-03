import { doc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';
import { auth } from '../firebaseConfig.js';

export function handleGameOutcome(cells, currentPlayer) {
    if (checkWinner(cells)) {
        setTimeout(() => {
            alert(currentPlayer + ' won this round!');
            location.reload();
        }, 100);
    } else if (isTie(cells)) {
        setTimeout(() => {
            alert("It's a tie!");
            location.reload();
        }, 100);
    }
}

function getNextPlayer(currentPlayerUid, players) {
    return players[0].uid === currentPlayerUid
        ? players[1].uid
        : players[0].uid;
}

export async function addEventListenersToCells(cells, gameBoardDoc, gameDoc) {
    const players = (await getDoc(gameDoc)).data().players; // Get the players array from the game data

    cells.forEach((cell, index) => {
        cell.addEventListener('click', async (e) => {
            // Fetch the current state of the game
            let gameDocSnapshot = await getDoc(gameDoc);
            let gameData = gameDocSnapshot.data();
            let currentPlayer = gameData.players.find(
                (player) => player.uid === gameData.currentPlayer
            );

            // Check if the current user is the current player
            // so that they cannot click on the board if it is not their turn
            const currentUserUid = auth.currentUser
                ? auth.currentUser.uid
                : null;
            if (currentPlayer.uid !== currentUserUid) {
                return; // If not, exit the function immediately 
            }

            if (e.target.textContent == '') {
                e.target.textContent = currentPlayer.symbol;

                // Fetch the current state of the game board
                let gameBoardDocSnapshot = await getDoc(gameBoardDoc);
                const gameBoardData = gameBoardDocSnapshot.data();

                // Update the specific cell in the array
                gameBoardData.cells[index] = currentPlayer.symbol;

                // Write the whole array back to Firestore
                await updateDoc(gameBoardDoc, { cells: gameBoardData.cells });

                // Switch turns
                const nextPlayer = getNextPlayer(currentPlayer.uid, players);
                await updateDoc(gameDoc, { currentPlayer: nextPlayer });

                handleGameOutcome(cells, currentPlayer.symbol);
            }
        });
    });
}

export function listenForGameBoardChanges(gameBoardDoc, cells) {
    onSnapshot(gameBoardDoc, (docSnapshot) => {
        const gameBoardData = docSnapshot.data();
        console.log(gameBoardData);
        const cellsData = gameBoardData.cells;
        cells.forEach((cell, index) => {
            cell.textContent = cellsData[index] || '';
        });
    });
}

function checkWinner(cells) {
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
    for (const combination of winCombination) {
        if (
            cells[combination[0]].textContent !== '' &&
            cells[combination[0]].textContent ===
                cells[combination[1]].textContent &&
            cells[combination[1]].textContent ===
                cells[combination[2]].textContent
        ) {
            return true;
        }
    }
    return false;
}

function isTie(cells) {
    return [...cells].every((cell) => cell.textContent !== '');
}
