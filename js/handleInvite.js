import { collection, query, onSnapshot, addDoc } from 'firebase/firestore';
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
                console.log('New invite: ', change.doc.data());
            }
        });
    });
}

export function sendInvite(uid) {
    console.log(`Sending invite to ${uid} from ${auth.currentUser.uid}`);
    const invitesCol = collection(db, 'users', uid, 'invites');
    addDoc(invitesCol, {
        from: auth.currentUser.uid,
        timestamp: Date.now(),
    });
}