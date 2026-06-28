//TOAST NAVIGATION ACTIVE STATE
document.addEventListener("DOMContentLoaded", () => {
  const toastLink = document.querySelectorAll("#bottomNavContainer a");

  toastLink.forEach((link) => {
    if (link.href === window.location.href) {
      link.classList.add("active");
    }
  });
});

window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if(!preloader) return;
  preloader.style.opacity = "0";
  preloader.style.display = "none";
});
//PopUp
const closePopup = document.getElementById("closePopup");
if (closePopup) {
  closePopup.addEventListener("click", () => {
    document.getElementById("popup").style.display = "none";
  });
}

//SIGNUP AND LOGIN FORMS
const signupFormLink = document.getElementById("signupFormLink");
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const loginFormLink = document.getElementById("loginFormLink");

if (signupFormLink) {
  signupFormLink.addEventListener("click", (event) => {
    event.preventDefault();
    signupForm.style.display = "block";
    loginForm.style.display = "none";
  });
}
if (loginFormLink) {
  loginFormLink.addEventListener("click", (event) => {
    event.preventDefault();
    signupForm.style.display = "none";
    loginForm.style.display = "block";
  });
}

// dark mode
function darkMode() {
  const darkModeBtn = document.getElementById("dark-mode");
  const body = document.body;

  // Read + convert to boolean
  let isDark = localStorage.getItem("darkMode") === "true";

  // Toggle
  isDark = !isDark;

  // Apply UI
  body.classList.toggle("darkMode", isDark);
  if (darkModeBtn) {
    darkModeBtn.textContent = isDark ? "☀️Light Mode" : "🌙Dark Mode";
  }

  // Save
  localStorage.setItem("darkMode", isDark);
}

document.addEventListener("DOMContentLoaded", () => {
  const darkModeBtn = document.getElementById("dark-mode");
  const body = document.body;

  const isDark = localStorage.getItem("darkMode") === "true";

  body.classList.toggle("darkMode", isDark);
  if (darkModeBtn) {
    darkModeBtn.textContent = isDark ? "Light Mode" : "Dark Mode";
  }
});


/*
//check if user has already seen the popup
const popup = this.document.getElementById("popup");
if (popup) {
  if (!localStorage.getItem("popupShown")) {
    document.getElementById("popup").style.display = "flex"; // Show popup
  } else {
    document.getElementById("popup").style.display = "none"; // Hide popup
  }
}

function closePopup() {
  localStorage.setItem("popupShown", "true"); // Remember that popup was shown
  const popup = document.getElementById("popup");
  popup.style.display = "none";
}
*/
const pages = document.querySelectorAll(".page");
function backToHome() {
  pages.forEach((page) => {
    if (page.querySelector(".backBtn")) return;
    const backLink = document.createElement("a");
    backLink.href = "./index.html";
    backLink.textContent = "← Back";
    backLink.classList.add("backBtn");
    page.prepend(backLink);
  });
}
//show recipes on click
function showPage(pageId) {
  pages.forEach((page) => (page.style.display = "none"));
  const page = document.getElementById(pageId);
  if (page) {
    backToHome();
    page.style.display = "block";
  }
}
// Check if a recipe key is passed in the URL
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const recipeKey = params.get("recipe");
  if (recipeKey) {
    // call showPage to display the saved recipe
    showPage(recipeKey);
  }
});

//For the recipe bot form
function findRecipe() {
  const userInput = document
    .getElementById("userInput")
    .value.toLowerCase()
    .trim();
  const infoNote = document.querySelector(".infoNote");
  const suggestions = document.getElementById("suggestions");
  const recipe = document.getElementsByClassName("recipe");
  let matches = [];

  if (!userInput) {
    infoNote.innerHTML = `<p>Please enter an ingredient.</p>`;
    return;
  }
  for (let i = 0; i < recipe.length; i++) {
    let keywordsAttr = recipe[i].getAttribute("data-keywords");
    let keywords = keywordsAttr ? keywordsAttr.toLowerCase() : "";
    if (keywords.includes(userInput)) {
      matches.push(recipe[i].outerHTML);
    }
  }

  if (matches.length > 0) {
    suggestions.innerHTML = `<p>Based on your ingredients, i suggest you try:</p> <br> ${matches.join("<br>")}`;
  } else {
    suggestions.textContent = `Sorry I do not have a recipe for that yet 😓.`;
  }
}

//FOR RECIPE SUBMITTION
const RecipeForm = document.getElementById("submitRecipeForm");
let savedCount = JSON.parse(localStorage.getItem("savedCount")) || 0;
const recipeSubmissionBtn = document.getElementById("recipeSubmissionBtn");
const submittedCount = document.getElementById("submittedCount");
let count = Number(savedCount);
if (submittedCount) {
  submittedCount.innerText = count;
}

if (recipeSubmissionBtn) {
  recipeSubmissionBtn.addEventListener("click", (e) => {
    e.preventDefault();

    //form inputs
    const recipeOwnername = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const ingredients = document.getElementById("ingredients").value;
    const instructions = document.getElementById("instructions").value;

    //Do not let submitted count work untill all fields are filled
    if (!recipeOwnername || !instructions || !email || !ingredients) {
      alert("Please fill all fields");
      return;
    } else {
      count++;
      submittedCount.innerText = count;
      localStorage.setItem("savedCount", JSON.stringify(count));
    }
    //Let form work normally(Formspree handles the rest)
    RecipeForm.submit();
  });
}
