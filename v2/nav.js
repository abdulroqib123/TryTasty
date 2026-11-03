//SIDEBAR TOGGLE
const sidebar = document.getElementById("sidebar");

function setupMenuIcons() {
  const menuIcon = document.querySelectorAll(".menu-icon");
  menuIcon.forEach((icon) => {
    icon.addEventListener("click", () => {
      sidebar.classList.toggle("show");
    });
  });
}

//Create Sidebar links in an array
const navLinks = [
  { text: "Home", href: "index.html", class: "toastNavLink" },
  { text: "Favorites", href: "favs.html", class: "toastNavLink" },
  { text: "Submit", href: "submit.html" },
  { text: "Privacy Policy", href: "privacyGerman.html" },
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
paragraph.innerText = "Version: 03.00.00";
sidebar.appendChild(paragraph);

const upperNavContainer = document.querySelector(".upperNavContainer");
if (upperNavContainer) {
  setupMenuIcons();
}
