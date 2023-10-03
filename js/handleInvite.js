import {
    collection,
    query,
    onSnapshot,
    addDoc,
    doc,
    deleteDoc,
    setDoc,
    getDocs,
} from 'firebase/firestore';
import { db, auth } from '../firebaseConfig.js';
import { addEventListenersToCells, listenForGameBoardChanges } from './game.js';

// functions for the user sending the invite
export async function sendInvite(uid) {
    try {
        console.log(`Sending invite to ${uid} from ${auth.currentUser.uid}`);
        const invitesCol = collection(db, 'users', uid, 'invites');
        await addDoc(invitesCol, {
            from: auth.currentUser.uid,
            timestamp: Date.now(),
        });
        listenForGameStart(`${uid}-${auth.currentUser.uid}`);
    } catch (error) {
        console.error('Error sending invite:', error);
    }
}
// This is essentially listening for if the person accepted the invite or not,
// at some point we will need to add a notification for when the user declines
export function listenForGameStart(gameId) {
    // Get a reference to the specific 'game' document
    const gameDoc = doc(db, 'games', gameId);

    // Listen for real-time updates to the game document
    onSnapshot(gameDoc, (docSnapshot) => {
        if (docSnapshot.exists()) {
            // Get the gameBoardId
            const gameBoardCol = collection(db, 'games', gameId, 'gameBoard');

            // Listen for real-time updates to the gameBoard collection
            onSnapshot(gameBoardCol, async (querySnapshot) => {
                if (!querySnapshot.empty) {
                    const gameBoardId = querySnapshot.docs[0].id; // Get the ID of the first (and only) gameBoard document

                    // Add the listeners here
                    const cells = document.querySelectorAll('.cell');
                    const gameBoardDoc = doc(
                        db,
                        'games',
                        gameId,
                        'gameBoard',
                        gameBoardId
                    );
                    addEventListenersToCells(cells, gameBoardDoc, gameDoc);
                    listenForGameBoardChanges(gameBoardDoc, cells);
                }
            });
        }
    });
}

// The next 3 functions are for the user receving the invite
export function listenForInvites(userId) {
    const invitesCol = collection(db, 'users', userId, 'invites');
    const q = query(invitesCol);
    onSnapshot(q, (querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                handleInvite(change.doc);
            }
        });
    });
}

function handleInvite(doc) {
    const inviteData = doc.data();
    const inviteFrom = inviteData.from;
    const inviteId = doc.id;
    const accepted = confirm(
        `New invite from ${inviteData.from}. Do you accept?`
    );
    handleInviteResponse(inviteFrom, inviteId, accepted);
}

async function handleInviteResponse(inviteFrom, inviteId, accepted) {
    if (accepted) {
        try {
            const gameBoardId = await createGame(inviteFrom);
            sessionStorage.setItem(
                'gameId',
                `${auth.currentUser.uid}-${inviteFrom}`
            );
            sessionStorage.setItem('gameBoardId', gameBoardId);

            // Wait for DOMContentLoaded event before accessing DOM elements
            await new Promise((resolve) => {
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', resolve);
                } else {
                    resolve();
                }
            });

            const cells = document.querySelectorAll('.cell');
            const gameId = sessionStorage.getItem('gameId');
            const gameBoardDoc = doc(
                db,
                'games',
                gameId,
                'gameBoard',
                gameBoardId
            );
            const gameDoc = doc(db, 'games', gameId);
            addEventListenersToCells(cells, gameBoardDoc, gameDoc);
            listenForGameBoardChanges(gameBoardDoc, cells);
        } catch (error) {
            console.error('Error creating game:', error);
        }
    } else {
        removeInvite(inviteId);
    }
}

// These functions create the game.
async function createGame(inviteFrom) {
    const gameId = `${auth.currentUser.uid}-${inviteFrom}`;
    const gameDoc = doc(db, 'games', gameId);
    await setDoc(gameDoc, getGameData(inviteFrom));
    const gameBoardCol = collection(db, 'games', gameId, 'gameBoard');
    const docRef = await addDoc(gameBoardCol, getGameBoardData());
    return docRef.id;
}

function getGameData(inviteFrom) {
    return {
        players: [
            { uid: auth.currentUser.uid, symbol: 'X' },
            { uid: inviteFrom, symbol: 'O' }
        ],
        timestamp: Date.now(),
        currentPlayer: auth.currentUser.uid,
    };
}

function getGameBoardData() {
    return {
        cells: Array(9).fill(0),
    };
}

// This keeps the database clean. Once the user has responded to the invite, the invite is removed.
function removeInvite(inviteId) {
    const inviteDoc = doc(
        db,
        'users',
        auth.currentUser.uid,
        'invites',
        inviteId
    );
    deleteDoc(inviteDoc);
}
