function e(e){return e&&e.__esModule?e.default:e}var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},n={},o={},l=t.parcelRequire8a3e;null==l&&((l=function(e){if(e in n)return n[e].exports;if(e in o){var t=o[e];delete o[e];var l={id:e,exports:{}};return n[e]=l,t.call(l.exports,l,l.exports),l.exports}var i=Error("Cannot find module '"+e+"'");throw i.code="MODULE_NOT_FOUND",i}).register=function(e,t){o[e]=t},t.parcelRequire8a3e=l),l.register("3ePpe",function(e,t){l("27Lyk").register(JSON.parse('{"qXT0n":"login.ca91de1b.js","7A3lL":"home.9f917cfa.html","3YQD3":"home.f536451c.css","1rD8F":"home.e54078db.js","87lIH":"login.67683850.js"}'))}),l.register("h59ig",function(t,n){var o=l("kxgSl"),i=l("4nZKn"),d=l("6Uh31"),a=l("ilpIi");window.onload=function(){console.log("window.onload"),// This event listener is triggered when the 'create-account' button is clicked.
// It changes the visible form to the 'create account' form.
document.getElementById("create-account").addEventListener("click",function(e){// Prevents the default action of the event.
e.preventDefault(),// Stops the propagation of the event to parent elements.
e.stopPropagation(),// Hides the 'login' form.
document.getElementById("login-form").style.display="none",// Displays the 'create account' form.
document.getElementById("create-account-form").style.display="block",// Hides the 'login' buttons.
document.getElementById("login-buttons").style.display="none"}),// This event listener is triggered when the 'back-to-login' button is clicked.
// It changes the visible form to the 'login' form.
document.getElementById("back-to-login").addEventListener("click",function(e){// Prevents the default action of the event.
e.preventDefault(),// Stops the propagation of the event to parent elements.
e.stopPropagation(),// Hides the 'create account' form.
document.getElementById("create-account-form").style.display="none",// Displays the 'login' form.
document.getElementById("login-form").style.display="block",// Displays the 'login' buttons.
document.getElementById("login-buttons").style.display="block"}),// This event listener is triggered when the 'create account' form is submitted.
// It calls the 'getFormSubmitHandler' method of the 'AuthService' class with the 'createUser' method as a parameter.
document.getElementById("create-account-form").addEventListener("submit",async function(t){// The 'getFormSubmitHandler' method returns a function that is immediately called with the event as a parameter.
// If the form submission is successful, the user is redirected to the '/home' page.
let n=await (0,o.default).getFormSubmitHandler(o.default.createUser,"create-account-form")(t);n&&(window.location.href=/*@__PURE__*/e(i))}),// This event listener is triggered when the 'login' form is submitted.
// It calls the 'getFormSubmitHandler' method of the 'AuthService' class with the 'loginUser' method as a parameter.
document.getElementById("login-form").addEventListener("submit",async function(t){// The 'getFormSubmitHandler' method returns a function that is immediately called with the event as a parameter.
// If the form submission is successful, the user is redirected to the '/home' page.
let n=await (0,o.default).getFormSubmitHandler(o.default.loginUser,"login-form")(t);if(n.success){let t=n.result.user.uid,o=(0,a.doc)(d.db,"users",t);// Update the 'online' field of the user document
await (0,a.updateDoc)(o,{online:!0}),window.location.href=/*@__PURE__*/e(i)}})},window.addEventListener("load",function(){// Fetch all the forms we want to apply custom Bootstrap validation styles to
var e=document.getElementsByClassName("needs-validation");// Loop over them and prevent submission
Array.prototype.filter.call(e,function(e){e.addEventListener("submit",function(t){!1===e.checkValidity()&&(t.preventDefault(),t.stopPropagation()),e.classList.add("was-validated")},!1)})},!1)}),l.register("4nZKn",function(e,t){e.exports=new URL(l("27Lyk").resolve("7A3lL"),import.meta.url).toString()}),l("3ePpe");//# sourceMappingURL=login.ca91de1b.js.map

//# sourceMappingURL=login.ca91de1b.js.map
