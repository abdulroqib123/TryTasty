const productContainer = document.querySelector(".productContainer");
import { filterAction } from "./productActions.js";

//Temu products
/*
AFFILIATE ACCOUNT SUSPENDED
fetch("../data/temuProduct.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    const temuProductsContainer = document.createElement("div");
    temuProductsContainer.classList.add("temuProductCardContainer");

    temuProductsContainer.innerHTML = data.products
      .map(
        (product) => `
      <div class="productItemContainer">
          <div class="imgContainer">
            <img
              src="${product.image}"
              alt="${product.title}"
              loading="lazy"
            />
            <p class="textOverlay">${product.imageLabel}</p>
   
               <span class="affiliateLabel">Anzeige(Ad.)</span>
         </div>

         <div class="text">
         <h2><a
         href="${product.link}"
         target="_blank"
         rel="sponsored nofollow"
         >${product.title}</a
         ></h2>
         <p>
         ${product.description.desc1}</p>
         <p>${product.description.desc2}</p>
         <a
         href="${product.link}"
         target="_blank"
         rel="sponsored nofollow"
         class="buyBtn"
         >Check on Temu</a
         >
         </div>
        </div>
      `,
      )
      .join("");

    productContainer.prepend(temuProductsContainer);
  });
*/

//Amazon products
fetch("../data/amazonProduct.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    const amazonProductsContainer = document.createElement("div");
    amazonProductsContainer.classList.add("amazonProductCardContainer");

    amazonProductsContainer.innerHTML = data.products
      .map(
        (product) => `
      <div class="productItemContainer">
          <div class="imgContainer">
            <img
              src="${product.image}"
              alt="${product.title}"
              loading="lazy"
            />
            <p class="textOverlay">${product.imageLabel}</p>
   
               <span class="affiliateLabel">Anzeige(Ad.)</span>
         </div>

         <div class="text">
         <h2><a
         href="${product.link}"
         target="_blank"
         rel="sponsored nofollow"
         >${product.title}</a
         ></h2>
         <p>
         ${product.description}</p>
         <a
         href="${product.link}"
         target="_blank"
         rel="sponsored nofollow"
         class="buyBtn"
         >Check on Amazon</a
         >
         </div>
        </div>
      `,
      )
      .join("");

    productContainer.append(amazonProductsContainer);
  })
  .then(() => {
    filterAction();
  });
