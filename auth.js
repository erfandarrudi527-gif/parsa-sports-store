/* ===== REGISTER ===== */

const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const message = document.getElementById("registerMessage");

    message.className = "auth-message";

    if (fullName === "" || email === "" || password === "" || confirmPassword === "") {
      showMessage(message, "لطفاً همه فیلدها را پر کنید", "error");
      return;
    }

    if (password.length < 6) {
      showMessage(message, "رمز عبور باید حداقل ۶ کاراکتر باشد", "error");
      return;
    }

    if (password !== confirmPassword) {
      showMessage(message, "رمز عبور و تکرار آن یکسان نیستند", "error");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const userExists = users.some(function (user) {
      return user.email === email;
    });

    if (userExists) {
      showMessage(message, "این ایمیل قبلاً ثبت شده است", "error");
      return;
    }

    const newUser = {
      id: Date.now(),
      fullName: fullName,
      email: email,
      password: password
    };

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));

    showMessage(message, "ثبت نام با موفقیت انجام شد. در حال انتقال به صفحه ورود...", "success");

    registerForm.reset();

    setTimeout(function () {
      window.location.href = "login.html";
    }, 1800);
  });
}


/* ===== LOGIN ===== */

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value.trim();
    const message = document.getElementById("loginMessage");

    message.className = "auth-message";

    if (email === "" || password === "") {
      showMessage(message, "لطفاً ایمیل و رمز عبور را وارد کنید", "error");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const foundUser = users.find(function (user) {
      return user.email === email && user.password === password;
    });

    if (!foundUser) {
      showMessage(message, "ایمیل یا رمز عبور اشتباه است", "error");
      return;
    }

    localStorage.setItem("loggedInUser", JSON.stringify(foundUser));

    showMessage(message, "ورود با موفقیت انجام شد. در حال انتقال...", "success");

    setTimeout(function () {
      window.location.href = "index.html";
    }, 1500);
  });
}


/* ===== SHOW MESSAGE FUNCTION ===== */

function showMessage(element, text, type) {
  element.textContent = text;
  element.classList.add(type);
}


/* ===== HEADER LOGIN STATUS ===== */

const loginLink = document.getElementById("login-link");
const registerLink = document.getElementById("register-link");
const logoutLink = document.getElementById("logout-link");

const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (loggedInUser) {
  if (loginLink) loginLink.style.display = "none";
  if (registerLink) registerLink.style.display = "none";
  if (logoutLink) logoutLink.style.display = "inline-block";
}

if (logoutLink) {
  logoutLink.addEventListener("click", function (e) {
    e.preventDefault();

    localStorage.removeItem("loggedInUser");

    window.location.href = "index.html";
  });
}
