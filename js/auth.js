import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from './firebaseConfig.js';
import loginPage from '../login.html';

export default class AuthService {
    // This method is used to create a new user with the provided username, email, and password.
    static async createUser(username, email, password) {
        // We use Firebase's createUserWithEmailAndPassword method to create a new user.
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        // We then add the new user's username to Firestore (a NoSQL cloud database).
        // We use the setDoc method to create a new document in the 'users' collection with the user's unique ID.
        await setDoc(doc(db, 'users', userCredential.user.uid), {
            username: username,
            online: true,
        });
        // If everything goes well, we return true.
        return true;
    }

    // This method is used to log in an existing user with the provided email and password.
    static async loginUser(email, password) {
        // We use Firebase's signInWithEmailAndPassword method to log in the user.
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        // Return the user's credentials.
        return userCredential;
    }

    // This method is used to log out the currently logged in user.
    static async logoutUser() {
        try {
            const uid = auth.currentUser.uid;
            // We use Firebase's signOut method to log out the user.
            await auth.signOut();
            const userRef = doc(db, 'users', uid);
            // Update the 'online' field of the user document
            await updateDoc(userRef, { online: false });
            window.location.href = loginPage;
        } catch (error) {
            return error.message;
        }
    }

    // This method is used to handle form submissions.
    static getFormSubmitHandler(action, resetFormId) {
        console.log('getFormSubmitHandler');
        // We return an async function that takes an event as a parameter.
        return async function (e) {
            // We prevent the default form submission behavior.
            e.preventDefault();

            // We get the form that triggered the event and the values of the email and password fields.
            let form = e.target;
            let email = document.getElementById(form.id + '-email').value;
            let password = document.getElementById(form.id + '-password').value;
            let username;

            // If the form is the create account form, we also get the value of the username field and check if the passwords match.
            if (form.id === 'create-account-form') {
                username = document.getElementById('signup-username').value;
                let confirmPassword =
                    document.getElementById('confirm-password').value;

                if (password !== confirmPassword) {
                    console.log('Passwords do not match');
                    return;
                }
            }

            // We check if the form is valid.
            if (!form.checkValidity()) {
                return;
            }

            // We try to execute the action (either creating a new user or logging in an existing user).
            try {
                const result =
                    form.id === 'create-account-form'
                        ? await action(username, email, password)
                        : await action(email, password);
                // If the action is successful, we return an object with success status and result.
                return { success: !!result, result };
            } catch (error) {
                // If there's an error, we log it and show a toast with the error message.
                console.log('Error logging in:', error.code, error);
                let toastBody = document.getElementById('toast-body');
                toastBody.textContent = AuthService.parseAuthError(error.code);
                let toast = document.querySelector('.toast');
                let bsToast = new bootstrap.Toast(toast);
                bsToast.show();
                // We also reset the form.
                document.getElementById(resetFormId).reset();
                return false;
            }
        };
    }

    // This method is used to parse Firebase authentication errors into a more user friendly format.
    static parseAuthError(errorCode) {
        // We use a switch statement to return a user-friendly error message based on the error code.
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
}
