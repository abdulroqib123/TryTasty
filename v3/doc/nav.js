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
  { text: "Home", href: "../../index.html" },
  { text: "Favorites", href: "../favs.html" },
  { text: "Shop", href: "../buy/shop.html" },

  { text: "Community", href: "../../TryTasty-community/community.html" },
  { text: "Submit", href: "../submit.html" },
  { text: "Privacy Policy", href: "privacyGerman.html" },
  { text: "About TryTasty", href: "about.html" },
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
paragraph.innerText = "Version: 3.3.8";
sidebar.appendChild(paragraph);

const upperNavContainer = document.querySelector(".upperNavContainer");
if (upperNavContainer) {
  upperNavContainer.innerHTML = ` <a href="../userProfile.html" class="userProfileLink">
           <svg
           class="profileImg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"
          />
        </svg>
            <span id="userName">username</span>
          </a>
          <div class="menu-icon">
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
          </div>`;
  setupMenuIcons();
}
