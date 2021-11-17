const BASE_URL = "http://localhost:8000";
let CURRENT_USER_ID = undefined;

const toastBox = document.getElementById("live-toast");
const toastMessage = document.getElementById("toast-message");

const navHomeBtn = document.getElementById("btn-nav-home");

const navRegisterBtn = document.getElementById("btn-nav-register");
const registerForm = document.getElementById("form-register");
const registerBtn = document.getElementById("form-register__btn");

const navLoginBtn = document.getElementById("btn-nav-login");
const loginForm = document.getElementById("form-login");
const loginBtn = document.getElementById("form-login__btn");

const navLogoutBtn = document.getElementById("btn-nav-logout");
const logoutBtn = document.getElementById("btn-logout");

const navEditBtn = document.getElementById("btn-nav-edit");
const editForm = document.getElementById("form-edit");
const editBtn = document.getElementById("form-edit__btn");

const navUserInfoBtn = document.getElementById("btn-nav-user-info");
const UserInfoTableBody = document.getElementById("user-info-table-body");

const navAllUsersBtn = document.getElementById("btn-nav-all-users");
const allUsersTableBody = document.getElementById("all-users-table-body");

const ALL_SECTION_NAMES = {
  "section-home": document.getElementById("section-home"),
  "section-register": document.getElementById("section-register"),
  "section-login": document.getElementById("section-login"),
  "section-edit": document.getElementById("section-edit"),
  "section-user-info": document.getElementById("section-user-info"),
  "section-all-users": document.getElementById("section-all-users"),
};

const ALL_NAV_BTNS = [navRegisterBtn, navLoginBtn, navLogoutBtn, navEditBtn, navUserInfoBtn, navAllUsersBtn];

//
// Utils
let messageBoxShow = (message) => {
  var toast = new bootstrap.Toast(toastBox);
  toastMessage.textContent = message;
  toast.show();
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

let deActivateAllSections = () => {
  for (const [section_name, section_dom] of Object.entries(ALL_SECTION_NAMES)) {
    section_dom.classList.remove("section-active");
  }
};

let deActivateAllNavBtns = () => {
  for (const item of ALL_NAV_BTNS) {
    item.classList.remove("active");
  }
};

//
// Logic & Flow
navHomeBtn.addEventListener("click", (e) => {
  deActivateAllSections();
  deActivateAllNavBtns();
  ALL_SECTION_NAMES["section-home"].classList.add("section-active");
});

navRegisterBtn.addEventListener("click", (e) => {
  deActivateAllSections();
  deActivateAllNavBtns();
  ALL_SECTION_NAMES["section-register"].classList.add("section-active");
  navRegisterBtn.classList.add("active");
});

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

navLoginBtn.addEventListener("click", (e) => {
  deActivateAllSections();
  deActivateAllNavBtns();
  ALL_SECTION_NAMES["section-login"].classList.add("section-active");
  navLoginBtn.classList.add("active");
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

navLogoutBtn.addEventListener("click", async (e) => {
  try {
    let response = await fetch(BASE_URL + "/user/logout", {
      method: "POST",
      credentials: "include",
    });

    let data = await response.json();
    await errorhandler(response, data);

    CURRENT_USER_ID = undefined;

    deActivateAllSections();
    deActivateAllNavBtns();

    messageBoxShow("Logged Out!");
  } catch (error) {
    messageBoxShow(error.message);
  }
});

navUserInfoBtn.addEventListener("click", async (e) => {
  try {
    let response = await fetch(BASE_URL + "/user/user", {
      method: "GET",
      credentials: "include",
    });

    let data = await response.json();
    await errorhandler(response, data);

    UserInfoTableBody.innerHTML = `
    <tr>
      <th scope="row">${data.data.id}</th>
      <td>${data.data.email}</td>
      <td>${data.data.first_name}</td>
      <td>${data.data.last_name}</td>
      <td>${data.data.gender}</td>
      <td>${data.data.birthday}</td>
      <td>${data.data.phone_number}</td>
      <td>${data.data.address}</td>
    </tr>
    `;

    deActivateAllSections();
    deActivateAllNavBtns();
    ALL_SECTION_NAMES["section-user-info"].classList.add("section-active");
    navUserInfoBtn.classList.add("active");

    messageBoxShow("Fetched User Info!");
  } catch (error) {
    messageBoxShow(error.message + ", maybe Login First!");
  }
});

navAllUsersBtn.addEventListener("click", async (e) => {
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

    deActivateAllSections();
    deActivateAllNavBtns();
    ALL_SECTION_NAMES["section-all-users"].classList.add("section-active");
    navAllUsersBtn.classList.add("active");

    messageBoxShow("Fetched All Users!");
  } catch (error) {
    messageBoxShow(error.message + ", maybe Login First!");
  }
});

navEditBtn.addEventListener("click", async (e) => {
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

    deActivateAllSections();
    deActivateAllNavBtns();
    ALL_SECTION_NAMES["section-edit"].classList.add("section-active");
    navEditBtn.classList.add("active");
  } catch (error) {
    messageBoxShow(error.message + ", maybe Login First!");
  }
});

editBtn.addEventListener("click", async (e) => {
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
