import { doc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';
import { auth } from '../firebaseConfig.js';

export function handleGameOutcome(cells, currentPlayer, gameBoardDoc, gameDoc, players) {
    if (checkWinner(cells)) {
        setTimeout(() => {
            alert(currentPlayer + ' won this round!');
            askToPlayAgain(gameBoardDoc, gameDoc, players);
        }, 100);
    } else if (isTie(cells)) {
        setTimeout(() => {
            alert("It's a tie!");
            askToPlayAgain(gameBoardDoc, gameDoc, players);
        }, 100);
    }
}

function askToPlayAgain(gameBoardDoc, gameDoc, players) {
    const playAgain = confirm('Do you want to play again?');
    if (playAgain) {
        location.reload();
    } else {
        alert('Thanks for playing! Come again');
        resetGameBoard(gameBoardDoc);
        resetGameData(gameDoc, players);
    }
}

async function resetGameBoard(gameBoardDoc) {
    // Reset the game board cells to an empty state (or your initial state)
    await updateDoc(gameBoardDoc, { cells: Array(9).fill('') }); // Assuming a 3x3 board
}

async function resetGameData(gameDoc, players) {
    // Reset other game data as required. 
    // Here, I'm resetting the currentPlayer to the first player.
    await updateDoc(gameDoc, { currentPlayer: players[0].uid });
    // Add any other resets that are required based on your game's needs.
}

function getNextPlayer(currentPlayerUid, players) {
    return players[0].uid === currentPlayerUid
        ? players[1].uid
        : players[0].uid;
}

export async function addEventListenersToCells(cells, gameBoardDoc, gameDoc) {
    const players = (await getDoc(gameDoc)).data().players;

    cells.forEach((cell, index) => {
        cell.addEventListener('click', async (e) => {
            let gameDocSnapshot = await getDoc(gameDoc);
            let gameData = gameDocSnapshot.data();
            let currentPlayer = gameData.players.find(
                (player) => player.uid === gameData.currentPlayer
            );

            const currentUserUid = auth.currentUser
                ? auth.currentUser.uid
                : null;
            if (currentPlayer.uid !== currentUserUid) {
                return; 
            }

            if (e.target.textContent == '') {
                e.target.textContent = currentPlayer.symbol;

                let gameBoardDocSnapshot = await getDoc(gameBoardDoc);
                const gameBoardData = gameBoardDocSnapshot.data();

                gameBoardData.cells[index] = currentPlayer.symbol;
                await updateDoc(gameBoardDoc, { cells: gameBoardData.cells });

                const nextPlayer = getNextPlayer(currentPlayer.uid, players);
                await updateDoc(gameDoc, { currentPlayer: nextPlayer });

                handleGameOutcome(cells, currentPlayer.symbol, gameBoardDoc, gameDoc, players);
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
