const BASE_URL = "http://localhost:8000";
let CURRENT_USER_ID = undefined;

let messageBox = document.getElementById("message-box");

let viewUserInfoBtn = document.getElementById("btn-viewUserInfo");
let userInfoForm = document.getElementById("form-user-info");

let viewAllUsersBtn = document.getElementById("btn-viewAllUsers");
let allUsersTableBody = document.getElementById("all-users-table-body");

let registerBtn = document.getElementById("form-register__btn");
let registerForm = document.getElementById("form-register");

let loginBtn = document.getElementById("form-login__btn");
let loginForm = document.getElementById("form-login");

let logoutBtn = document.getElementById("btn-logout");

let editBtn = document.getElementById("btn-editUser");
let formEditBtn = document.getElementById("form-edit__btn");
let editForm = document.getElementById("form-edit");

let messageBoxShow = (message) => {
  messageBox.innerHTML = message;
  setTimeout(() => {
    messageBox.innerHTML = "";
  }, 3000);
};

let errorhandler = (response, data) => {
  if (response.ok) {
    return data;
  } else {
    if (data.detail) {
      throw new Error(data.detail);
    } else {
      console.log(data);
      throw new Error(response.status + " " + response.statusText);
    }
  }
};

// Logic
registerBtn.addEventListener("click", async (e) => {
  try {
    let response = await fetch(BASE_URL + "/user/register", {
      method: "POST",
      body: new FormData(registerForm),
    });

    let data = await response.json();
    await errorhandler(response, data);

    registerForm.reset();
    messageBoxShow("Register Successful!");
  } catch (error) {
    messageBoxShow(error.message);
  }
});

loginBtn.addEventListener("click", async (e) => {
  try {
    let response = await fetch(BASE_URL + "/user/login", {
      method: "POST",
      body: new FormData(loginForm),
      credentials: "include",
    });

    let data = await response.json();
    await errorhandler(response, data);

    CURRENT_USER_ID = data.data.id;
    loginForm.reset();
    messageBoxShow("Login Successful!");
  } catch (error) {
    messageBoxShow(error.message);
  }
});

logoutBtn.addEventListener("click", async (e) => {
  try {
    let response = await fetch(BASE_URL + "/user/logout", {
      method: "POST",
      credentials: "include",
    });

    let data = await response.json();
    await errorhandler(response, data);

    CURRENT_USER_ID = undefined;
    messageBoxShow("Logged Out!");
  } catch (error) {
    messageBoxShow(error.message);
  }
});

viewUserInfoBtn.addEventListener("click", async (e) => {
  try {
    let response = await fetch(BASE_URL + "/user/user", {
      method: "GET",
      credentials: "include",
    });

    let data = await response.json();
    await errorhandler(response, data);

    const { elements } = userInfoForm;
    for (const [key, value] of Object.entries(data.data)) {
      const field = elements.namedItem(key);
      field && (field.value = value);
    }

    messageBoxShow("Fetched User Info!");
  } catch (error) {
    messageBoxShow(error.message + ", maybe Login First!");
  }
});

viewAllUsersBtn.addEventListener("click", async (e) => {
  try {
    let response = await fetch(BASE_URL + "/user/users", {
      method: "GET",
      credentials: "include",
    });

    let data = await response.json();
    await errorhandler(response, data);

    allUsersTableBody.innerHTML = "";
    for (const item of data.data) {
      let tableRow = document.createElement("tr");
      tableRow.innerHTML = `
          <th scope="row">${item.id}</th>
          <td>${item.email}</td>
          <td>${item.first_name}</td>
          <td>${item.last_name}</td>
          <td>${item.phone_number}</td>
          <td>${item.gender}</td>
      `;
      allUsersTableBody.appendChild(tableRow);
    }

    messageBoxShow("Fetched All Users!");
  } catch (error) {
    messageBoxShow(error.message + ", maybe Login First!");
  }
});

editBtn.addEventListener("click", async (e) => {
  try {
    let response = await fetch(BASE_URL + "/user/user", {
      method: "GET",
      credentials: "include",
    });

    let data = await response.json();
    await errorhandler(response, data);

    CURRENT_USER_ID = data.data.id;

    const { elements } = editForm;
    for (const [key, value] of Object.entries(data.data)) {
      const field = elements.namedItem(key);
      field && (field.value = value);
    }
  } catch (error) {
    messageBoxShow(error.message + ", maybe Login First!");
  }
});

formEditBtn.addEventListener("click", async (e) => {
  try {
    let response = await fetch(BASE_URL + "/user/update/" + CURRENT_USER_ID, {
      method: "PUT",
      body: new FormData(editForm),
      credentials: "include",
    });

    let data = await response.json();
    await errorhandler(response, data);

    editForm.reset();
    messageBoxShow("Edit Successful!");
  } catch (error) {
    messageBoxShow(error.message);
  }
});
