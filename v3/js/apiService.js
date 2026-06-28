// js/apiService.js

export function normalizeExternalRecipe(apiRecipe) {
  if (!apiRecipe) return null;

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = apiRecipe[`strIngredient${i}`];
    const measure = apiRecipe[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      ingredients.push(
        `${measure ? measure.trim() + " " : ""}${ingredient.trim()}`,
      );
    }
  }

  return {
    id: `api-${apiRecipe.idMeal}`, // Prefixed identifier
    isExternal: true, // Structural flag
    title: apiRecipe.strMeal,
    description: `A classic ${apiRecipe.strCategory || "International"} dish.`,
    image: apiRecipe.strMealThumb,
    ingredients: ingredients,
    steps: apiRecipe.strInstructions
      ? apiRecipe.strInstructions
          .split(/\r?\n/)
          .filter((s) => s.trim().length > 3)
      : [],
  };
}

export async function fetchExternalRecipeById(id) {
  const cleanId = id.replace("api-", "");
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${cleanId}`,
    );
    const data = await response.json();
    return data.meals ? normalizeExternalRecipe(data.meals[0]) : null;
  } catch (error) {
    console.error("Failed to fetch external recipe info", error);
    return null;
  }
}
 