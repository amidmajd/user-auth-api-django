BASE_URL = "http://localhost:8000";

var messageBox = document.getElementById("message-box");

var viewUserInfoBtn = document.getElementById("btn-viewUserInfo");
var viewAllUsersBtn = document.getElementById("btn-viewAllUsers");

var registerBtn = document.getElementById("form-register__btn");
var registerForm = document.getElementById("form-register");

var loginBtn = document.getElementById("form-login__btn");
var loginForm = document.getElementById("form-login");

var logoutBtn = document.getElementById("btn-logout");

var editBtn = document.getElementById("btn-editUser");
var formEditBtn = document.getElementById("form-edit__btn");
var editForm = document.getElementById("form-edit");

let CURRENT_USER_ID = undefined;

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
    body: new FormData(loginForm),
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      CURRENT_USER_ID = data.data.id;

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

      CURRENT_USER_ID = undefined;

      messageBox.innerHTML = "Logged Out!";
      setTimeout(() => {
        messageBox.innerHTML = "";
      }, 3000);
    });
});

editBtn.addEventListener("click", (e) => {
  fetch(BASE_URL + "/user/user", {
    method: "GET",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      CURRENT_USER_ID = data.data.id;

      const { elements } = editForm;
      for (const [key, value] of Object.entries(data.data)) {
        const field = elements.namedItem(key);
        field && (field.value = value);
      }
    });
});

formEditBtn.addEventListener("click", (e) => {
  fetch(BASE_URL + "/user/update/" + CURRENT_USER_ID, {
    method: "PUT",
    body: new FormData(editForm),
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      editForm.reset();
      messageBox.innerHTML = "Edit Successful!";
      setTimeout(() => {
        messageBox.innerHTML = "";
      }, 3000);
    });
});
