import {
    doc,
    getDoc,
} from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js';
import { db, auth } from './firebaseConfig.js';

window.onload = function () {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const docRef = doc(db, 'users', user.uid);
            getDoc(docRef).then((docSnap) => {
                if (docSnap.exists()) {
                    console.log('Document data:', docSnap.data());
                    const username = docSnap.data().username;
                    document.getElementById(
                        'user-greeting'
                    ).textContent = `Hello, ${username}!`;
                } else {
                    console.log('No such document!');
                }
            });
        } else {
            // User is signed out
            console.log('No user is signed in.');
        }
    });
};
