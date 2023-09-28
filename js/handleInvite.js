import {
    collection,
    query,
    onSnapshot,
    addDoc,
    doc,
    deleteDoc,
    setDoc,
} from 'firebase/firestore';
import { db, auth } from '../firebaseConfig.js';

export function listenForInvites(userId) {
    // Get a reference to the user's invites collection
    const invitesCol = collection(db, 'users', userId, 'invites');
    // Create a query to get all documents in the user's invites collection
    const q = query(invitesCol);

    // Listen for real-time updates to the query
    onSnapshot(q, (querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                const inviteData = change.doc.data();
                const inviteFrom = inviteData.from;
                const inviteId = change.doc.id;
                const accepted = confirm(
                    `New invite from ${inviteData.from}. Do you accept?`
                );
                handleInviteResponse(inviteFrom, inviteId, accepted);
            }
        });
    });
}

function handleInviteResponse(inviteFrom, inviteId, accepted) {
    if (accepted) {
        // Create a new document in the 'games' collection of both users
        const gameData = {
            players: [auth.currentUser.uid, inviteFrom],
            timestamp: Date.now(),
            // Add any other game data you need here
        };

        const gameId = `${auth.currentUser.uid}-${inviteFrom}`;

        // creates a new document in the 'games' collection of the user accepting the invite
        const currentUserGameDoc = doc(
            db,
            'users',
            auth.currentUser.uid,
            'games',
            gameId
        );
        setDoc(currentUserGameDoc, gameData);

        // creates a new document in the 'games' collection of the user who sent the invite
        const inviteFromGameDoc = doc(db, 'users', inviteFrom, 'games', gameId);
        setDoc(inviteFromGameDoc, gameData);

        // Create a new document for the game board
        const gameBoardData = {
            cells: Array(9).fill(0), // Initialize an array of 9 0s to represent an empty game board
            // Add any other game board data you need here
        };

        // Create a new document in the 'gameBoard' subcollection of the 'games' collection for the user accepting the invite
        const currentUserGameBoardDoc = doc(
            db,
            'users',
            auth.currentUser.uid,
            'games',
            gameId,
            'gameBoards',
            'gameBoard'
        );
        setDoc(currentUserGameBoardDoc, gameBoardData);

        // Create a new document in the 'gameBoard' subcollection of the 'games' collection for the user who sent the invite
        const inviteFromGameBoardDoc = doc(
            db,
            'users',
            inviteFrom,
            'games',
            gameId,
            'gameBoards',
            'gameBoard'
        );
        setDoc(inviteFromGameBoardDoc, gameBoardData);
        // set the gameId in sessionStorage so we can access it later
        sessionStorage.setItem('gameId', gameId);
    }

    // Remove the invite from the 'invites' collection
    const inviteDoc = doc(
        db,
        'users',
        auth.currentUser.uid,
        'invites',
        inviteId
    );
    deleteDoc(inviteDoc);
}

export function sendInvite(uid) {
    console.log(`Sending invite to ${uid} from ${auth.currentUser.uid}`);
    const invitesCol = collection(db, 'users', uid, 'invites');
    addDoc(invitesCol, {
        from: auth.currentUser.uid,
        timestamp: Date.now(),
    });
}
