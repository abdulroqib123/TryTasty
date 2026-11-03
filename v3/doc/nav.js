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

  setupMenuIcons();
}
