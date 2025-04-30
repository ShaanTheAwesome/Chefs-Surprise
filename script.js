document.getElementById("recipe-display").style.display = "none";

document.getElementById("generate-recipe").addEventListener("click", () => {
    
    fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then(res => res.json())
    .then(data => {
        if (data.meals) {
            document.getElementById("recipe-title").textContent = data.meals[0].strMeal;

            document.getElementById("loading").style.display = "block";
            document.getElementById("image").src = data.meals[0].strMealThumb;

            const imgElement = document.getElementById("image");
            imgElement.onload = function() {
                document.getElementById("loading").style.display = "none";
            }

            // Collects the ingredients and measurements required 
            // for the recipe and puts it into an array
            var ingredients = [];
            for (var i=1; i<=20; i++) {
                const ingredient = data.meals[0][`strIngredient${i}`];
                
                // Ensures the recipe is valid
                if (ingredient === "" || ingredient === null) {
                    continue;
                }

                const measurement = data.meals[0][`strMeasure${i}`]
                const combination = measurement + " " + ingredient;

                ingredients.push(combination);
            }

            // Displays the ingredients required for the generated meal
            document.getElementById("ingredients-list").innerHTML = ingredients
                .map(ingredient => `<li>${ingredient}</li>`)
                .join("");

            // Filters the recipe instructions into a numbered bullet point form
            const instructions = data.meals[0].strInstructions.split(". ").filter(step => step.trim() !== "");
            document.getElementById("instructions-list").innerHTML = instructions
                .map(step => `<li>${step}</li>`)
                .join("");
            

            // Displays everything on the web
            document.getElementById("recipe-display").style.display = "block";
        }
    })
});