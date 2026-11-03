//SIDEBAR TOGGLE
const sidebar = document.getElementById("sidebar");
const overlay = document.querySelector(".overlay");

function sidebarfunc() {
  sidebar.classList.toggle("show");
  overlay.classList.toggle("appear");
  document.body.classList.toggle("lockScroll");
}
function setupMenuIcons() {
  const menuIcon = document.querySelectorAll(".menu-icon");
  menuIcon.forEach((icon) => {
    icon.addEventListener("click", () => {
      sidebarfunc();
    });
  });

  overlay.addEventListener("click", () => {
    sidebarfunc();
  });
}

//Create Sidebar links in an array
const navLinks = [
  { text: "Home", href: "../index.html", class: "toastNavLink" },
  { text: "Favorites", href: "favs.html", class: "toastNavLink" },
  { text: "Utensils", href: "buy/shop.html" },
  { text: "Submit", href: "submit.html" },
  { text: "About TryTasty", href: "doc/about.html" },
];

//Loop through each link and create a new one for each link
navLinks.forEach((link) => {
  //create anchor elemnt
  const a = document.createElement("a");

  //add content to the created element
  a.textContent = link.text;
  a.href = link.href;
  a.className = link.class;

  //append all created elements into sidebar
  sidebar.appendChild(a);
});

//Version number
const paragraph = document.createElement("p");
paragraph.innerText = "Version: 3.5.1";
sidebar.appendChild(paragraph);

const upperNavContainer = document.querySelector(".upperNavContainer");
if (upperNavContainer) {
  
  setupMenuIcons();
}

const bottomNavContainer = document.getElementById("bottomNavContainer");
bottomNavContainer.innerHTML = `
 <a href="../index.html" aria-label="Home">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Z"
          />
        </svg>
          <span>Home</span>

      </a>

      <a href="favs.html" aria-label="Favorites">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"
          />
        </svg>
          <span>Favorites</span>

      </a>

          <a href="buy/shop.html" arial-label="Shop">
      <svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 -960 960 960"
  fill="currentColor"
  aria-hidden="true"
>
  <path
    d="M160-200v-360l80-200h480l80 200v360H520v-160H440v160H160Zm80-80h120v-160h240v160h120v-280H240v280Zm40-360h400l-32-80H312l-32 80Zm-40 360v-280 280Z"
  />
</svg>
          <span>Shop</span>
</a>

`;

function callToFeedback() {
  const div = document.createElement("div");
  div.className = "feedbackPopupModal";
  div.innerHTML = `
  
  <div class="feedbackModalContentContainer">
  <div class="closeModal">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>

<h2>Write us a Feedback</h2>
<p>We want to make TryTasty better for you!</p>
<p>Tell us your experience using TryTasty.</p>
<a class="loginBtn" href="feedbacks/index.html">Write to us</a>
</div>
`;
  const main = document.querySelector("main");
  main.append(div);

  const closeModal = document.querySelector(".closeModal");
  closeModal.addEventListener("click", () => {
    div.style.display = "none";
  });
}

//call the funtion after approximately 5mins
setTimeout(() => {
  callToFeedback();
}, 299999);
