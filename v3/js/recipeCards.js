const page = document.querySelector(".page");

// --- STATE TRACKING ---
let currentBatch = 1;
let apiMealIndex = 0; // Tracks our position in the API meals array
let cachedApiMeals = []; // Stores the API meals once fetched

// --- CREATE THE ONE AND ONLY CONTAINING GRID ---
const mainRecipeGrid = document.createElement("div");
mainRecipeGrid.classList.add("allRecipeDiv");
page.prepend(mainRecipeGrid);

// --- CREATE THE ONE AND ONLY LOAD MORE BUTTON ---
const loadMoreBtn = document.createElement("button");
loadMoreBtn.type = "button";
loadMoreBtn.id = "mainLoadMoreBtn";
loadMoreBtn.classList.add("loadMoreBtns");
loadMoreBtn.innerHTML = `
  <span>Load More</span>
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
`;
page.appendChild(loadMoreBtn);

// --- UTILITY: RENDER CARDS DIRECTLY INTO THE MAIN CONTAINER ---
function appendRecipesToGrid(recipes) {
  recipes.forEach((rec) => {
    const isExternal = String(rec.id).startsWith("api-");
    const tagText = isExternal ? "TheMealDB" : "TryTasty Original";
    const tagClass = isExternal ? "tag-external" : "tag-original";

    const cardHTML = `
      <a href="v3/recipe.html?id=${rec.id}" data-keywords="${rec.dataKeywords || ""}" class="snackImage recipe">
        <div class="recipe-tag ${tagClass}">${tagText}</div>
        <img loading="lazy" src="${rec.image}" title="Click to see details" alt="${rec.title}" />
        <span class="recipe-title">${rec.title}</span>
      </a>
    `;
    // Inject directly into the existing grid without wiping out previous items
    mainRecipeGrid.insertAdjacentHTML("beforeend", cardHTML);
  });
}

// --- UTILITY: GENERIC FAILURE DISPLAY ---
function handlePageFailure() {
  mainRecipeGrid.innerHTML = ""; // Clear grid if base structure completely breaks
  if (loadMoreBtn) loadMoreBtn.remove();

  const failureDiv = document.createElement("div");
  failureDiv.style.textalign = "center";
  failureDiv.classList.add("failedToLoad");
  failureDiv.innerHTML = `
    <svg width="240" height="220" viewBox="0 0 240 220" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="120" cy="120" rx="95" ry="70" fill="#fff6e6"/>
      <circle cx="120" cy="115" r="55" fill="#ffffff" stroke="#ffc861" stroke-width="3"/>
      <circle cx="120" cy="115" r="35" fill="#fff3cf"/>
      <circle cx="108" cy="108" r="4" fill="#333"/>
      <circle cx="132" cy="108" r="4" fill="#333"/>
      <path d="M105 128 Q120 118 135 128" stroke="#333" stroke-width="3" fill="none"/>
      <rect x="60" y="85" width="8" height="55" rx="4" fill="#b4c3ff"/>
      <circle cx="64" cy="80" r="10" fill="#b4c3ff"/>
      <rect x="172" y="85" width="8" height="55" rx="4" fill="#b4c3ff"/>
      <rect x="169" y="75" width="3" height="12" rx="2" fill="#b4c3ff"/>
      <rect x="173" y="75" width="3" height="12" rx="2" fill="#b4c3ff"/>
      <rect x="177" y="75" width="3" height="12" rx="2" fill="#b4c3ff"/>
      <circle cx="40" cy="55" r="4" fill="#ffe07a"/>
      <circle cx="205" cy="50" r="5" fill="#ffe07a"/>
      <circle cx="200" cy="165" r="4" fill="#ffe07a"/>
      <text x="120" y="185" text-anchor="middle" font-size="12" font-family="Arial" fill="#666">
        Oops… snacks didn’t load
      </text>
    </svg>
    <p style="text-align: center; opacity: 0.3;">Failed to load data. Please reload the app.</p>
    <a href="feedbacks/index.html">Report this issue</a>
  `;
  page.prepend(failureDiv);
}

// --- MASTER CONTROLLER: WHAT HAPPENS ON CLICK ---
loadMoreBtn.addEventListener("click", () => {
  if (currentBatch === 1) {
    loadLocalBatch("v3/data/recipes/recipes2.json");
  } else {
    loadNextExternalApiSet();
  }
});

// --- CORE FETCH 1: INITIAL SELECTION ---
fetch("v3/data/recipes/recipes1.json")
  .then((r) => {
    if (!r.ok) throw new Error("Batch 1 file error");
    return r.json();
  })
  .then((data) => {
    appendRecipesToGrid(data.recipes);
  })
  .catch((error) => {
    console.error("Initial load error:", error);
    handlePageFailure();
  });

// --- CORE FETCH 2: LAZY LOCAL SNACKS ---
function loadLocalBatch(filePath) {
  fetch(filePath)
    .then((r) => {
      if (!r.ok) throw new Error("Local batch file error");
      return r.json();
    })
    .then((data) => {
      appendRecipesToGrid(data.recipes);
      currentBatch = 2; // Advance state to API mode for next clicks
    })
    .catch((error) => {
      console.error("Local batch error:", error);
      handlePageFailure();
    });
}

// --- CORE FETCH 3: STEPPED API LOOPS ---
function loadNextExternalApiSet() {
  const itemsPerLoad = 8; // How many API items to load per click

  // If we haven't fetched the API list yet, fetch it once and cache it
  if (cachedApiMeals.length === 0) {
    fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=Side")
      .then((r) => {
        if (!r.ok) throw new Error("API base fetch error");
        return r.json();
      })
      .then((data) => {
        if (!data.meals) throw new Error("No meals in category");
        cachedApiMeals = data.meals;
        renderCachedApiSegment(itemsPerLoad);
      })
      .catch((error) => {
        console.error("External API initial fetch error:", error);
        handlePageFailure();
      });
  } else {
    // If already cached, just render the next chunk
    renderCachedApiSegment(itemsPerLoad);
  }
}

// Helper to chunk out cached items so it doesn't overload the browser
function renderCachedApiSegment(count) {
  const nextSegment = cachedApiMeals.slice(apiMealIndex, apiMealIndex + count);

  if (nextSegment.length === 0) {
    // No more recipes left to pull from the API category
    loadMoreBtn.innerHTML = "<span>No More Snacks Available</span>";
    loadMoreBtn.disabled = true;
    return;
  }

  const normalized = nextSegment.map((meal) => ({
    id: `api-${meal.idMeal}`,
    title: meal.strMeal,
    image: meal.strMealThumb,
    dataKeywords: "external, mealdb, quick snack, side",
  }));

  appendRecipesToGrid(normalized);
  apiMealIndex += count; // Advance position tracker for the next click
}
