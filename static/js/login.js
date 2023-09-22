import { AuthService } from './auth.js';

window.onload = function () {
    // This event listener is triggered when the 'create-account' button is clicked.
    // It changes the visible form to the 'create account' form.
    document
        .getElementById('create-account')
        .addEventListener('click', function (e) {
            // Prevents the default action of the event.
            e.preventDefault();
            // Stops the propagation of the event to parent elements.
            e.stopPropagation();
            // Hides the 'login' form.
            document.getElementById('login-form').style.display = 'none';
            // Displays the 'create account' form.
            document.getElementById('create-account-form').style.display =
                'block';
            // Hides the 'login' buttons.
            document.getElementById('login-buttons').style.display = 'none';
        });

    // This event listener is triggered when the 'back-to-login' button is clicked.
    // It changes the visible form to the 'login' form.
    document
        .getElementById('back-to-login')
        .addEventListener('click', function (e) {
            // Prevents the default action of the event.
            e.preventDefault();
            // Stops the propagation of the event to parent elements.
            e.stopPropagation();
            // Hides the 'create account' form.
            document.getElementById('create-account-form').style.display =
                'none';
            // Displays the 'login' form.
            document.getElementById('login-form').style.display = 'block';
            // Displays the 'login' buttons.
            document.getElementById('login-buttons').style.display = 'block';
        });

    // This event listener is triggered when the 'create account' form is submitted.
    // It calls the 'getFormSubmitHandler' method of the 'AuthService' class with the 'createUser' method as a parameter.
    document
        .getElementById('create-account-form')
        .addEventListener('submit', async function (e) {
            // The 'getFormSubmitHandler' method returns a function that is immediately called with the event as a parameter.
            // If the form submission is successful, the user is redirected to the '/home' page.
            const success = await AuthService.getFormSubmitHandler(
                AuthService.createUser,
                'create-account-form'
            )(e);
            if (success) {
                window.location.href = '/home';
            }
        });
    // This event listener is triggered when the 'login' form is submitted.
    // It calls the 'getFormSubmitHandler' method of the 'AuthService' class with the 'loginUser' method as a parameter.
    document
        .getElementById('login-form')
        .addEventListener('submit', function (e) {
            // Prevents the default action of the event.
            e.preventDefault();
            // The 'getFormSubmitHandler' method returns a function that is immediately called with the event as a parameter.
            // If the form submission is successful, the user is redirected to the '/home' page.
            AuthService.getFormSubmitHandler(
                AuthService.loginUser,
                'login-form'
            )(e).then((success) => {
                if (success) {
                    window.location.href = '/home';
                }
            });
        });
};
