const recipeDisplay = document.getElementById("recipe-display");
const categorySelect = document.getElementById("categories");

recipeDisplay.style.display = "none";

// ── Populate the category dropdown on page load ──────────────────────────
fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
  .then(res => res.json())
  .then(data => {
    data.categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.strCategory;
      option.textContent = cat.strCategory;
      categorySelect.appendChild(option);
    });
  });

// ── Generate recipe button ───────────────────────────────────────────────
document.getElementById("generate-recipe").addEventListener("click", () => {
  const category = categorySelect.value;

  if (category === "any") {
    // No category selected — fetch a completely random meal directly
    fetchAndDisplayMeal("https://www.themealdb.com/api/json/v1/1/random.php");
  } else {
    // Fetch all meals in the chosen category, pick one at random,
    // then look up its full details (filter endpoint only returns basic info)
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
      .then(res => res.json())
      .then(data => {
        const meals = data.meals;
        const randomMeal = meals[Math.floor(Math.random() * meals.length)];
        fetchAndDisplayMeal(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${randomMeal.idMeal}`);
      });
  }
});

// ── Shared function to fetch a meal URL and render it ────────────────────
function fetchAndDisplayMeal(url) {
  document.getElementById("loading").style.display = "block";
  document.getElementById("recipe-title").textContent = "";
  document.getElementById("image").src = "";
  document.getElementById("ingredients-list").innerHTML = "";
  document.getElementById("instructions-list").innerHTML = "";
  recipeDisplay.style.display = "grid";

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (!data.meals) return;

      const meal = data.meals[0];

      document.getElementById("recipe-title").textContent = meal.strMeal;
      document.getElementById("image").src = meal.strMealThumb;

      document.getElementById("image").onload = function () {
        document.getElementById("loading").style.display = "none";
      };

      // Collect ingredients + measurements
      const ingredients = [];
      for (var i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (!ingredient || ingredient.trim() === "") continue;
        const measurement = meal[`strMeasure${i}`] || "";
        ingredients.push(measurement + " " + ingredient);
      }

      document.getElementById("ingredients-list").innerHTML = ingredients
        .map(ingredient => `<li>${ingredient}</li>`)
        .join("");

      // Split instructions into steps
      const instructions = meal.strInstructions
        .split(". ")
        .filter(step => step.trim() !== "");

      document.getElementById("instructions-list").innerHTML = instructions
        .map(step => `<li>${step}</li>`)
        .join("");
    });
}