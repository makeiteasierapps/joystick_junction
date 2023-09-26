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
            e.stopPropagation();
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('create-account-form').style.display =
                'block';
            document.getElementById('login-buttons').style.display = 'none';
        });

    // Change form to login form
    document
        .getElementById('back-to-login')
        .addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            document.getElementById('create-account-form').style.display =
                'none';
            document.getElementById('login-form').style.display = 'block';
            document.getElementById('login-buttons').style.display = 'block';
        });

    // Form validation function
    function validateForm(form) {
        return form.checkValidity();
    }

    // Create Account
    document
        .getElementById('create-account-form')
        .addEventListener('submit', async function (e) {
            e.preventDefault();

            let form = e.target;
            let username = document.getElementById('signup-username').value;
            let email = document.getElementById('email').value;
            let password = document.getElementById('signup-password').value;
            let confirmPassword =
                document.getElementById('confirm-password').value;

            // Call the form validation function
            if (!validateForm(form)) {
                // If form validation fails, stop the login process
                return;
            }

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
                console.log('Error logging in:', error.code, error);
                let toastBody = document.getElementById('toast-body');
                toastBody.textContent = parseAuthError(error.code);
                let toast = document.querySelector('.toast');
                let bsToast = new bootstrap.Toast(toast);
                bsToast.show();
                document.getElementById('login-form').reset();
            }

            document.getElementById('create-account-form').reset();
        });

    // Login
    document
        .getElementById('login-form')
        .addEventListener('submit', async function (e) {
            e.preventDefault();

            let form = e.target;
            let email = document.getElementById('login-email').value;
            let password = document.getElementById('login-password').value;

            if (!validateForm(form)) {
                // If form validation fails, stop the login process
                return;
            }

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
                let toastBody = document.getElementById('toast-body');
                toastBody.textContent = parseAuthError(error.code);
                let toast = document.querySelector('.toast');
                let bsToast = new bootstrap.Toast(toast);
                bsToast.show();
                document.getElementById('login-form').reset();
            }

            document.getElementById('login-form').reset();
        });

    function parseAuthError(errorCode) {
        switch (errorCode) {
            case 'auth/email-already-in-use':
                return 'This email is already in use.';
            case 'auth/invalid-email':
                return 'The email address is not valid.';
            case 'auth/invalid-login-credentials':
                return 'Invalid email or password. Please try again.';
            case 'auth/weak-password':
                return 'Password must be at least 6 characters.';
            case 'auth/user-not-found':
                return 'No user found with this email.';
            case 'auth/wrong-password':
                return 'Invalid password for the given email.';
            default:
                return 'An unknown error occurred.';
        }
    }
};
