const params = new URLSearchParams(window.location.search);
const recipeId = params.get("id");
const mode = params.get("mode");

document.addEventListener("DOMContentLoaded", () => {
  if (mode === "cook" && recipeId) {
    enterCookMode(recipeId);
  }
});

function enterCookMode(recipeId) {
  setTimeout(() => {
    document.querySelector("main").classList.add("activeUtilityMain");
    document.body.classList.add("lockScroll");
  }, 1000);

  const recipeUtilitySection = document.getElementById("recipeUtility");

  // Load multiple recipe files (same as main recipe page)
  const recipeFiles = [
    "data/recipes/recipes1.json",
    "data/recipes/recipes2.json",
  ];

  Promise.all(recipeFiles.map((file) => fetch(file).then((r) => r.json())))
    .then((results) => {
      const allRecipes = results.flatMap((r) => r.recipes);

      const recipe = allRecipes.find((r) => r.id === recipeId);
      if (!recipe) return;

      const totalTimeMin =
        recipe.prepTimeMin + recipe.cookTimeMin + recipe.coolTime;

      recipeUtilitySection.innerHTML = `
        <button class="backBtn cookModeExit">← Exit cook mode</button>
        <h2>Cooking: ${recipe.title}</h2>

        <section class="meta">
          <span>⏱ Prep: ${recipe.prepTimeMin} min</span>
          <span>🔥 Cook: ${recipe.cookTimeMin} min</span>
          <span>❄️ Cooling: ${recipe.coolTime}</span>
          <span>⌛ Total: ${totalTimeMin} min</span>
          <span>🍽 Serves: ${recipe.servings}</span>
        </section>

        <h3>Grocery List:</h3>
        <div class="listContainer groceryListContainer">
          ${recipe.utility.groceryList
            .map(
              (g) =>
                `<label><input type="checkbox"><span>${g.item}:</span> <span class="valueData">${g.quantity}</span></label>`,
            )
            .join("")}
        </div>

        <div class="infoNote tip"  contenteditable="true">
          <b  contenteditable="false">Tip:</b> ${recipe.utility.notes.defaultTip}
        </div>

        <h3>Utensils:</h3>
        <section class="listContainer equipmentListContainer">
          ${recipe.utility.equipment
            .map(
              (e) => `<label><input type="checkbox"><span>${e}</span></label>`,
            )
            .join("")}
          <a class="buyBtn" target="_blank" href="buy/shop.html">Get In Shop</a>
        </section>

        <h3>Steps:</h3>
        <section class="listContainer stepListContainer">
          ${recipe.utility.stepFlow
            .map(
              (s) => `
              <div class="steps">
                <span>Step ${s.step}: </span>
                <p>${s.text}</p>
                <span class="valueData">Estimated Time: ${s.estTimeMin} min</span>
              </div>`,
            )
            .join("")}
        </section>

        <div id="completedTask">
          <h3>Completed:</h3>
        </div>

        <p style="text-align: center; opacity: 0.3;">Cooking...</p>
      `;

      recipeUtilitySection.addEventListener("change", (e) => {
        if (e.target.type !== "checkbox") return;

        const checkbox = e.target;
        const label = checkbox.closest("label");
        const checkedContainer = document.getElementById("completedTask");

        if (checkbox.checked) {
          checkedContainer.appendChild(label);
        }
      });

      exitCookMode();
    })
    .catch(() => {
      document.getElementById("recipeUtility").innerHTML = `
        <a class="backBtn cookModeExit" href="../index.html">← Home</a>
        <div style="text-align: center;" class="failedToLoad">
          <p style="text-align: center; color: gray;">Cook Mode isn't available on this recipe yet.</p>
          <a href="feedbacks/index.html">Report this issue</a>
        </div>`;
    });
}

function exitCookMode() {
  const cookModeExit = document.querySelector(".cookModeExit");
  if (!cookModeExit) return;

  cookModeExit.addEventListener("click", () => {
    const confirmExit = confirm("Exit cooking mode? Progress will reset.");
    if (!confirmExit) return;
    window.history.back();
  });
}
