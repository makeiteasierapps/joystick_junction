import { db, auth } from './firebaseConfig.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js';
import {
    doc,
    setDoc,
} from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js';

window.onload = function () {
    // Change form to create account form
    document
        .getElementById('create-account')
        .addEventListener('click', function (e) {
            e.preventDefault();
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('create-account-form').style.display =
                'block';
        });
    // Change form to login form
    document
        .getElementById('back-to-login')
        .addEventListener('click', function (e) {
            e.preventDefault();
            document.getElementById('create-account-form').style.display =
                'none';
            document.getElementById('login-form').style.display = 'block';
        });

    // Create Account
    document
        .getElementById('submitCreate')
        .addEventListener('click', async function (e) {
            e.preventDefault();

            let username = document.getElementById('signup-username').value;
            let email = document.getElementById('email').value;
            let password = document.getElementById('signup-password').value;
            let confirmPassword =
                document.getElementById('confirm-password').value;

            // Check if passwords match
            if (password !== confirmPassword) {
                console.log('Passwords do not match');
                return;
            }

            try {
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
                console.log('User account created:', userCredential.user);

                // Add the username to Firestore and wait for it to complete
                await setDoc(doc(db, 'users', userCredential.user.uid), {
                    username: username,
                });

                // Redirect to home page
                window.location.href = '/home';
            } catch (error) {
                console.log('Error creating user account:', error);
            }

            document.getElementById('create-account-form').reset();
        });

    // Login
    document
        .getElementById('login-button')
        .addEventListener('click', async function (e) {
            e.preventDefault();

            let email = document.getElementById('login-email').value;
            let password = document.getElementById('login-password').value;

            try {
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
                console.log('User logged in:', userCredential.user);

                window.location.href = '/home';
            } catch (error) {
                console.log('Error logging in:', error.code, error);
            }

            document.getElementById('login-form').reset();
        });
};
