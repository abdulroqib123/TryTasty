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

const botLink = document.querySelector(".botLink");
const popularSection = document.querySelector(".popular-section");
const faq = document.querySelector(".faq");

if (botLink) {
  botLink.addEventListener("click", () => {
    sidebarfunc();
    faq.classList.toggle("hide");
    popularSection.classList.toggle("hide");
  });
}
//Create Sidebar links in an array
const navLinks = [
  { text: "Home", href: "index.html", class: "toastNavLink" },
  { text: "Favorites", href: "v3/favs.html", class: "toastNavLink" },
  { text: "Utensils", href: "v3/buy/shop.html", class: "toastNavLink" },
  { text: "Submit", href: "v3/submit.html" },
  {
    text: "Community",
    href: "../TryTasty-community/community.html",
    class: "toastNavLink",
  },
  { text: "About TryTasty", href: "v3/doc/about.html" },
];

//Loop through each link and create a new one for each link
navLinks.forEach((link) => {
  //create anchor elemnt
  const a = document.createElement("a");

  //add content to the created element
  a.textContent = link.text;
  a.href = link.href;
  a.classList = link.class;

  //append all created elements into sidebar
  sidebar.appendChild(a);
});

//Version number
const paragraph = document.createElement("p");
paragraph.innerText = "Version: 3.5.1";
sidebar.appendChild(paragraph);

const upperNavContainer = document.querySelector(".upperNavContainer");
if (upperNavContainer) {
  upperNavContainer.innerHTML = `<a href="v3/userProfile.html" class="userProfileLink">
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
            <span id="userName"></span>
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
          </div>
              `;
  setupMenuIcons();
}

const bottomNavContainer = document.getElementById("bottomNavContainer");

bottomNavContainer.innerHTML = `
 <a href="index.html" aria-label="Home">
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

      <a href="v3/favs.html" aria-label="Favorites">
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

          <a href="v3/buy/shop.html" arial-label="Shop">
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

      
      <a href="v3/userProfile.html" aria-label="Profile">
    <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
    fill="currentColor"
    aria-hidden="true"
    >
    <path
    d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"
    />
  </svg>
    <span>Profile</span>
</a>


<a href="TryTasty-community/community.html" aria-label="Community">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true">
    <path d="M320-540q-46 0-78-32t-32-78q0-46 32-78t78-32q46 0 78 32t32 78q0 46-32 78t-78 32Zm320 0q-46 0-78-32t-32-78q0-46 32-78t78-32q46 0 78 32t32 78q0 46-32 78t-78 32ZM200-200v-104q0-34 17.5-61.5T264-408q45-23 90.5-33.5T440-452q-19 14-32 36.5T395-360v160H200Zm365 0v-160q0-29-13-51.5T520-452q55 1 100.5 11.5T711-408q29 15 46 42.5t17 61.5v104H565Z"/>
  </svg>
  <span>Community</span>
</a>
`;
