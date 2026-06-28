import { addToFav } from "../js/fav.js";
import { fetchExternalRecipeById } from "../js/apiService.js";

const params = new URLSearchParams(window.location.search);
const recipeId = params.get("id");
const recipeContainer = document.getElementById("recipe");

// Safety gate check
if (!recipeId) {
  recipeContainer.innerHTML = `
    <a class="backBtn" href="../index.html">← Back</a>
    <p style="text-align: center; opacity: 0.3; margin-top: 2rem;">Recipe not found.</p>
  `;
  throw new Error("Missing recipeId");
}

// --- ENTRY ROUTER CONTROL ---
if (recipeId.startsWith("api-")) {
  // Pull from Public API
  fetchExternalRecipeById(recipeId)
    .then((recipe) => {
      if (!recipe) throw new Error("API Recipe not found");
      renderRecipePage(recipe, true);
    })
    .catch((err) => handleFailure(err));
} else {
  // Pull from local JSON structure files
  const recipeFiles = [
    "data/recipes/recipes1.json",
    "data/recipes/recipes2.json",
  ];

  Promise.all(recipeFiles.map((file) => fetch(file).then((r) => r.json())))
    .then((results) => {
      const allRecipes = results.flatMap((r) => r.recipes);
      const recipe = allRecipes.find((r) => r.id === recipeId);

      if (!recipe) throw new Error("Local recipe database match not found");
      renderRecipePage(recipe, false);
    })
    .catch((err) => handleFailure(err));
}

// --- UNIFIED RENDERING LAYER ---
function renderRecipePage(recipe, isExternal) {
  // 1. Structural Schema.org LD+JSON Injection
  const toISO = (min) => `PT${min || 0}M`;
  const recipeSchema = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": window.location.href,
    },
    name: recipe.title,
    description: recipe.description,
    image: recipe.image ? [recipe.image] : undefined,
    keywords: recipe.dataKeywords || undefined,
    url: window.location.href,
    author: {
      "@type": "Organization",
      name: "TryTasty",
    },
    prepTime: toISO(recipe.prepTimeMin),
    cookTime: toISO(recipe.cookTimeMin),
    totalTime: toISO((recipe.prepTimeMin || 0) + (recipe.cookTimeMin || 0)),
    recipeYield: `${recipe.servings || 2} serving${recipe.servings === 1 ? "" : "s"}`,
    recipeCuisine: recipe.cuisine || "International",
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.steps.map((step, index) => ({
      "@type": "HowToStep",
      name: "Step " + (index + 1),
      text: step,
    })),
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(recipeSchema);

  document.title = `${recipe.title} | TryTasty`;

  const metaOgImg = document.createElement("meta");
  metaOgImg.property = "og:image";
  metaOgImg.content = `${recipe.image}`;
  document.head.append(metaOgImg, script);

  // 2. Variable Calculations & Conditional Layout Switches
  const coolingTime = recipe.coolTime || 0;
  const totalTimeMin =
    (recipe.prepTimeMin || 0) + (recipe.cookTimeMin || 0) + coolingTime;

  // Render original Cook Mode button OR API notification info box
  const cookModeActionHTML = isExternal
    ? `<p class="cookModeUnavailable" style="text-align: center; opacity: 0.6; padding: 0.5rem; background: var(--card-bg, #1e1e1e); border-radius: 8px;">🍲 Interactive Cook Mode is optimized for TryTasty original snack selections.</p>`
    : `<a href="cookMode.html?id=${recipe.id}&mode=cook" class="activateCookMode">🍲Start Cook Mode</a>`;

  // Safely fallback structural elements if inner links do not exist
  const hasInnerLink =
    recipe.innerLink && recipe.innerLink[0] && recipe.innerLink[0].link;
  const recommendationsHTML = hasInnerLink
    ? `<p class="alsoLike">You might also like <a href="recipe.html?id=${recipe.innerLink[0].link}">${recipe.innerLink[0].name}</a></p>`
    : `<p class="alsoLike">Explore more tasty selections on the <a href="../index.html">Home Menu</a></p>`;

  // 3. Inject Layout string directly into container
  recipeContainer.innerHTML = `
    <div class="recipeActionBtns">
      <a class="backBtn" href="../index.html">← Home</a>
      <button class="shareBtn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
          viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
          <line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
        </svg>
        Share
      </button>
    </div>

    <article>
      <h1>${recipe.title}</h1>
      <section class="meta">
        <span>⏱ Prep: ${recipe.prepTimeMin || 0} min</span>
        <span>🔥 Cook: ${recipe.cookTimeMin || 0} min</span>
        <span>❄️ Cooling: ${coolingTime} min</span>
        <span>⌛ Total: ${totalTimeMin} min</span>
        <span>🍽 Serves: ${recipe.servings || 2}</span>
      </section>

      <p class="recipeDesc">${recipe.description || ""}</p>
      
      ${cookModeActionHTML}
      
      <hr class="divider">

      <section class="flexRecipeContent">
        <img loading="lazy" src="${recipe.image}" alt="${recipe.title}"/>
        <div class="recipeTexts">

          <section>
            <h2>Ingredients</h2>
            <ul>
              ${recipe.ingredients.map((i) => `<li>${i}</li>`).join("")}
            </ul>
          </section>

          <section>
            <h2>Instructions</h2>
            <ol>
              ${recipe.steps.map((s) => `<li>${s}</li>`).join("")}
            </ol>
          </section>

          <button
            class="add-fav"
            data-key="${recipe.id}"
            data-name="${recipe.title}"
            data-img="${recipe.image}"
          >
            Add to favorites
          </button>

        </div>
      </section>

      ${recommendationsHTML}
    </article>
  `;

  // Bind side-effects functionality
  setupShareButton();
  addToFav();
}

// --- HELPER FUNCTION: SHARING LAYER ---
function setupShareButton() {
  const btn = document.querySelector(".shareBtn");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "TryTasty Recipe",
          text: `Check out this recipe on TryTasty 👀🍽️`,
          url,
        });
      } catch (err) {
        /* Catch share cancellations quietly */
      }
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert("Link copied to clipboard!");
      });
    }
  });
}

// --- HELPER FUNCTION: CATCH ERROR BREAKS ---
function handleFailure(error) {
  console.error("TryTasty Error Log:", error);
  recipeContainer.innerHTML = `
    <a class="backBtn" href="../index.html">← Back</a>
    <div style="text-align: center;" class="failedToLoad">
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
          Oops… data didn’t load
        </text>
      </svg>
      <p style="text-align: center; color: gray;">Failed to find or parse recipe data. Please <a href="feedbacks/index.html">Report this issue</a>.</p>
    </div>
  `;
}
