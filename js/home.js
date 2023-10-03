import { db, auth } from '../firebaseConfig.js';
import {
    collection,
    query,
    onSnapshot,
    doc,
} from 'firebase/firestore';
import AuthService from './auth.js';
import { listenForInvites, sendInvite } from './handleInvite.js';

// This firebase method is triggered when the authentication state changes (i.e. when the user logs in or logs out).
// it is always listening for changes in the authentication state.
auth.onAuthStateChanged(async function (user) {
    if (user) {
        await handleUserSignedIn(user);
    } else {
        // No user is signed in.
    }
});

async function handleUserSignedIn(user) {
    const idToken = await user.getIdToken();
    const data = await fetchUserData(idToken);
    if (data) {
        greetUser(data.username);
        await getOnlineUsers();
    }
    listenForInvites(user.uid);

}

async function fetchUserData(idToken) {
    try {
        const response = await fetch('http://localhost:5000/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: idToken,
            },
        });
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

function greetUser(username) {
    document.getElementById(
        'user-greeting'
    ).textContent = `Hello, ${username}!`;
}

function getOnlineUsers() {
    // We return a new Promise which will be resolved when the list of users is fetched.
    return new Promise((resolve, reject) => {
        // We get a reference to the 'users' collection in the Firestore database.
        const usersCol = collection(db, 'users');
        // We create a query to get all documents in the 'users' collection.
        const q = query(usersCol);
        // We use the onSnapshot method to listen for real-time updates to the query.
        onSnapshot(
            q,
            (querySnapshot) => {
                let users = [];
                // We iterate over each document in the query snapshot.
                querySnapshot.forEach((doc) => {
                    let user = doc.data();
                    user.uid = doc.id;
                    users.push(user);
                });
                // We clear the previous list of users in the HTML.
                document.getElementById('users-list').innerHTML = '';
                // We iterate over each user in the users array.
                users.forEach((user) => {
                    let btn = document.createElement('button');
                    btn.textContent = user.username;
                    btn.className = 'btn btn-danger';
                    // console.log(user);
                    btn.addEventListener('click', () => sendInvite(user.uid));
                    // If the user is online, we add a green dot next to their name.
                    if (user.online) {
                        let span = document.createElement('span');
                        span.style.backgroundColor = 'green';
                        span.style.borderRadius = '50%';
                        span.style.display = 'inline-block';
                        span.style.width = '10px';
                        span.style.height = '10px';
                        span.style.marginLeft = '5px';
                        // We append the green dot to the list item.
                        btn.appendChild(span);
                    }
                    // We append the list item to the 'users-list' element in the HTML.
                    document.getElementById('users-list').appendChild(btn);
                });
                resolve(users);
            },
            // If there's an error, we reject the promise with the error.
            reject
        );
    });
}

// Logout button
const logoutButton = document.getElementById('logout-button');
logoutButton.addEventListener('click', AuthService.logoutUser);

// let gamesPlayed = 0;
// let wins = 0;
// let losses = 0;
// let ties = 0;

// function updateStatistics(outcome) {
//     console.log('Updating statistics...');
//     gamesPlayed++;
//     if (outcome === 'win') {
//         wins++;
//     } else if (outcome === 'loss') {
//         losses++;
//     } else if (outcome === 'tie') {
//         ties++;
//     }

//     document.getElementById('games-played').textContent =
//         gamesPlayed.toString();
//     document.getElementById('wins').textContent = wins.toString();
//     document.getElementById('losses').textContent = losses.toString();
//     document.getElementById('ties').textContent = ties.toString();
// }
