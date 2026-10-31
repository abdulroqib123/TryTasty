import {
  googleLogin,
  signup,
  login,
  logout,
  onUserAuthChange,
} from "./../v2/js/auth.js";

const logoutBtn = document.getElementById("logoutBtn");
const welcomeText = document.getElementById("welcomeText");
const popup = document.getElementById("popup");
const loginInputForm = document.getElementById("loginInputForm");
const nonUserMessage = document.getElementById("non-userMessage");
const recipeForm = document.getElementById("recipeSubmissionForm");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const userName = document.getElementById("userName");
const Useremail = document.getElementById("Useremail");
const loginLink = document.getElementById("loginLink");
const googleBtn = document.querySelectorAll(".google-btn");
const infoNoteLogin = document.querySelector(".infoNoteLogin");

// Listen for auth state changes
onUserAuthChange((user) => {
  if (user) {
    welcomeText &&
      (welcomeText.innerText = user.displayName || user.email || "User");

    Useremail && (Useremail.innerText = user.email || "-");

    userName && (userName.innerText = user.displayName || "Profile");

    logoutBtn && (logoutBtn.style.display = "block");
    loginLink && (loginLink.innerText = "Logout");
    popup && (popup.style.display = "none");
    loginInputForm && (loginInputForm.style.display = "none");
    nonUserMessage && (nonUserMessage.style.display = "none");
    recipeForm && (recipeForm.style.display = "block");
  } else {
    Useremail && (Useremail.innerText = "Login first");
    userName && (userName.innerText = "Login first");
    loginLink && (loginLink.innerText = "Login");
    loginLink && (loginLink.style.display = "block");
    popup && (popup.style.display = "flex");
    nonUserMessage && (nonUserMessage.style.display = "block");
    recipeForm && (recipeForm.style.display = "none");
    welcomeText && (welcomeText.innerText = "");
    loginInputForm && (loginInputForm.style.display = "block");
  }
});

window.googleLogin = async () => {
  try {
    const result = await googleLogin();
    window.location.href = "submit.html";
    alert(`Welcome, ${result.user.displayName}`);
  } catch (e) {
    alert(e.message);
  }
};

googleBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    googleLogin();
  });
});

if (signupBtn) {
  // Signup
  signupBtn.addEventListener("click", async () => {
    const userNameInputValue = document.getElementById("userNameInput").value;
    const email = document.getElementById("emailForSignup").value;
    const password = document.getElementById("passwordForSignup").value;
    const confirmPassword = document.getElementById(
      "re-enterPasswordForSignup"
    ).value;
    const infoNoteSignup = document.querySelector(".infoNoteSignup");

    if (!userNameInputValue || !password || !confirmPassword) {
      infoNoteSignup.classList.add("errorShow");
      infoNoteSignup.textContent = "Please fill all forms.";
      return;
    }
    if (!email.includes("@")) {
      infoNoteSignup.classList.add("errorShow");
      infoNoteSignup.textContent = "Please input a valid email address";
      return;
    }
    if (password !== confirmPassword) {
      infoNoteSignup.classList.add("errorShow");
      infoNoteSignup.textContent = "Passwords do not match.";
      return;
    }

    try {
      const user = await signup(userNameInputValue, email, password);

      const userName = document.getElementById("userName");
      if (userName) userName.innerText = user.displayName;

      alert("Signup successful!");
      window.location.href = "../index.html";
    } catch (error) {
      infoNoteSignup.classList.add("errorShow");

      infoNoteSignup.textContent = error.message;
    }
  });
}

if (loginBtn) {
  // Login
  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    if (!email || !password) {
      infoNoteLogin.textContent = "Email and password are required";
      return;
    }

    try {
      await login(email, password);
      alert("Login successful!");
      window.location.href = "../index.html";
    } catch (error) {
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
      window.location.href = "https://trytasty.de/v2/welcome.html";
    } catch (error) {
      alert(error.message);
    }
  });
}
