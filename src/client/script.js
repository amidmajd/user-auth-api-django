BASE_URL = "http://localhost:8000";

var messageBox = document.getElementById("message-box");

var viewUserInfoBtn = document.getElementById("btn-viewUserInfo");
var viewAllUsersBtn = document.getElementById("btn-viewAllUsers");

var registerBtn = document.getElementById("form-register__btn");
var registerForm = document.getElementById("form-register");

var loginBtn = document.getElementById("form-login__btn");
var loginForm = document.getElementById("form-login");

var logoutBtn = document.getElementById("btn-logout");

// Logic
registerBtn.addEventListener("click", (e) => {
  fetch(BASE_URL + "/user/register", {
    method: "POST",
    body: new FormData(registerForm),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      registerForm.reset();

      messageBox.innerHTML = "Register Successful!";
      setTimeout(() => {
        messageBox.innerHTML = "";
      }, 3000);
    });
});

loginBtn.addEventListener("click", (e) => {
  fetch(BASE_URL + "/user/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "amidmajd@gmail.com", password: "amidmajd" }),
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      loginForm.reset();

      messageBox.innerHTML = "Login Successful!";
      setTimeout(() => {
        messageBox.innerHTML = "";
      }, 3000);
    });
});

viewUserInfoBtn.addEventListener("click", (e) => {
  fetch(BASE_URL + "/user/user", {
    method: "GET",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      messageBox.innerHTML = "Fetched User Info!";
      setTimeout(() => {
        messageBox.innerHTML = "";
      }, 3000);
    });
});

viewAllUsersBtn.addEventListener("click", (e) => {
  fetch(BASE_URL + "/user/users", {
    method: "GET",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      messageBox.innerHTML = "Fetched All Users!";
      setTimeout(() => {
        messageBox.innerHTML = "";
      }, 3000);
    });
});

logoutBtn.addEventListener("click", (e) => {
  fetch(BASE_URL + "/user/logout", {
    method: "POST",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      messageBox.innerHTML = "Logged Out!";
      setTimeout(() => {
        messageBox.innerHTML = "";
      }, 3000);
    });
});
