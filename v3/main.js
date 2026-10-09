import {
  googleLogin,
  signup,
  login,
  logout,
  onUserAuthChange,
} from "./../v3/js/auth.js";
import {
  magnifyImg
} from "https://ui.scybud.com/js/ui.js"

const logoutBtn = document.getElementById("logoutBtn");
export const welcomeText = document.getElementById("welcomeText");
const popup = document.getElementById("popup");
const loginInputForm = document.getElementById("loginInputForm");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const userName = document.getElementById("userName");
const Useremail = document.getElementById("Useremail");
const loginLink = document.getElementById("loginLink");
const googleBtn = document.querySelectorAll(".google-btn");
const infoNoteLogin = document.querySelector(".infoNoteLogin");
const buttons = document.querySelectorAll("button");

//Authstatechanged(loggedin)
function loggedIn(user) {
  welcomeText &&
    (welcomeText.textContent = user.displayName || user.email || "User");
  Useremail && (Useremail.textContent = user.email || "-");
  userName &&
    (userName.textContent = user.displayName.slice(0, 5) + "..." || "Profile");
  logoutBtn && (logoutBtn.style.display = "block");
  loginLink && (loginLink.style.display = "none");
  popup && (popup.style.display = "none");
  loginInputForm && (loginInputForm.style.display = "none");
}

//authstatechanged(loggedout)
function loggedout() {
  logoutBtn && (logoutBtn.style.display = "none");
  Useremail && (Useremail.innerText = "Login first");
  userName && (userName.innerText = "username");
  loginLink && (loginLink.innerText = "Login");
  loginLink && (loginLink.style.display = "block");
  popup && (popup.style.display = "flex");
  welcomeText && (welcomeText.innerText = "");
  loginInputForm && (loginInputForm.style.display = "block");
}

// Listen for auth state changes
onUserAuthChange((user) => {
  if (user) {
    loggedIn(user);
  } else {
    loggedout();
  }
});

googleBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    googleLogin();
  });
});

if (signupBtn) {
  // Signup
  signupBtn.addEventListener("click", async () => {
    if (buttons) {
      buttons.forEach((btn) => {
        btn.classList.add("disable");
      });
    }
    const userNameInputValue = document.getElementById("userNameInput").value;
    const email = document.getElementById("emailForSignup").value;
    const password = document.getElementById("passwordForSignup").value;
    const confirmPassword = document.getElementById(
      "re-enterPasswordForSignup",
    ).value;
    const infoNoteSignup = document.querySelector(".infoNoteSignup");

    if (!userNameInputValue || !password || !confirmPassword) {
      if (buttons) {
        buttons.forEach((btn) => {
          btn.classList.remove("disable");
        });
      }
      infoNoteSignup.classList.add("errorShow");
      infoNoteSignup.textContent = "Please fill all forms.";
      return;
    }
    if (!email.includes("@")) {
      if (buttons) {
        buttons.forEach((btn) => {
          btn.classList.remove("disable");
        });
      }
      infoNoteSignup.classList.add("errorShow");
      infoNoteSignup.textContent = "Please input a valid email address";
      return;
    }
    if (password !== confirmPassword) {
      if (buttons) {
        buttons.forEach((btn) => {
          btn.classList.remove("disable");
        });
      }
      infoNoteSignup.classList.add("errorShow");
      infoNoteSignup.textContent = "Passwords do not match.";
      return;
    }

    try {
      const user = await signup(userNameInputValue, email, password);

      const userName = document.getElementById("userName");
      if (userName) userName.innerText = user.displayName;

      alert("Signup successful!");
      if (buttons) {
        buttons.forEach((btn) => {
          btn.classList.remove("disable");
        });
      }
      window.location.href = "../index.html";
    } catch (error) {
      infoNoteSignup.classList.add("errorShow");
      if (buttons) {
        buttons.forEach((btn) => {
          btn.classList.remove("disable");
        });
      }
      infoNoteSignup.textContent = error.message;
    }
  });
}

if (loginBtn) {
  // Login
  loginBtn.addEventListener("click", async () => {
    if (buttons) {
      buttons.forEach((btn) => {
        btn.classList.add("disable");
      });
    }
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    if (!email || !password) {
      if (buttons) {
        buttons.forEach((btn) => {
          btn.classList.remove("disable");
        });
      }
      infoNoteLogin.textContent = "Email and password are required";
      return;
    }
    try {
      await login(email, password);
      alert("Login successful!");
      window.location.href = "../index.html";
    } catch (error) {
      if (buttons) {
        buttons.forEach((btn) => {
          btn.classList.remove("disable");
        });
      }
      infoNoteLogin.classList.add("errorShow");

      if (error.message === "Firebase: Error (auth/invalid-credential)") {
        infoNoteLogin.textContent =
          "The credential is malformed or expired. Try google signin";
      } else if (
        error.message === "Firebase: Error (auth/too-many-requests)."
      ) {
        infoNoteLogin.textContent = "Too many requests. Try again later";
      } else if (error.message === "Firebase: Error (auth/user-not-found).") {
        infoNoteLogin.textContent = "No user exists with this email.";
      } else if (
        error.message === "Firebase: Error (auth/invalid-credential)."
      ) {
        infoNoteLogin.textContent =
          "Wrong input. User signed-up with google or user has no account.";
      } else {
        infoNoteLogin.textContent = error.message;
      }
    }
  });
}

if (logoutBtn) {
  // Logout
  logoutBtn.addEventListener("click", async () => {
    try {
      await logout();
      alert("Logged out successfully!");
      window.location.href = "welcome.html";
    } catch (error) {
      alert(error.message);
    }
  });
}

const imgs = document?.querySelectorAll("img")
imgs.forEach((img) => {
  magnifyImg(img)
})