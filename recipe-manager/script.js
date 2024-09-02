document.addEventListener("DOMContentLoaded", () => {
    loadRecipes();
    document.getElementById('fetch-random-recipe').addEventListener('click', fetchRandomRecipe);
    document.getElementById('toggle-add-recipe-form').addEventListener('click', toggleAddRecipeForm);
});

function toggleAddRecipeForm() {
    document.getElementById('add-recipe-form').classList.toggle('hidden');
}

function addRecipe() {
    const name = document.getElementById('recipe-name').value;
    const ingredients = document.getElementById('recipe-ingredients').value;
    const instructions = document.getElementById('recipe-instructions').value;

    if (name && ingredients && instructions) {
        const recipe = {
            id: Date.now(),
            name,
            ingredients: ingredients.split(',').map(item => item.trim()),
            instructions
        };

        let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
        recipes.push(recipe);
        localStorage.setItem('recipes', JSON.stringify(recipes));

        document.getElementById('add-recipe-form').classList.add('hidden');
        loadRecipes();
    } else {
        alert('Please fill in all fields.');
    }
}

function loadRecipes() {
    const recipesList = document.getElementById('recipes-list');
    recipesList.innerHTML = '';

    let recipes = JSON.parse(localStorage.getItem('recipes')) || [];

    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        recipeCard.innerHTML = `
            <h3>${recipe.name}</h3>
            <p><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
            <p><strong>Instructions:</strong> ${recipe.instructions}</p>
            <button class="btn edit" onclick="editRecipe(${recipe.id})">Edit</button>
            <button class="btn" onclick="deleteRecipe(${recipe.id})">Delete</button>
        `;
        recipesList.appendChild(recipeCard);
    });
}

function editRecipe(id) {
    let recipes = JSON.parse(localStorage.getItem('recipes'));
    const recipe = recipes.find(r => r.id === id);
    
    document.getElementById('recipe-name').value = recipe.name;
    document.getElementById('recipe-ingredients').value = recipe.ingredients.join(', ');
    document.getElementById('recipe-instructions').value = recipe.instructions;

    deleteRecipe(id);
    toggleAddRecipeForm();
}

function deleteRecipe(id) {
    let recipes = JSON.parse(localStorage.getItem('recipes'));
    recipes = recipes.filter(recipe => recipe.id !== id);
    localStorage.setItem('recipes', JSON.stringify(recipes));
    loadRecipes();
}

async function fetchRandomRecipe() {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        const data = await response.json();
        const meal = data.meals[0];

        const recipe = {
            id: Date.now(),
            name: meal.strMeal,
            ingredients: meal.strIngredient1 ? [meal.strIngredient1, meal.strIngredient2, meal.strIngredient3].filter(Boolean) : [],
            instructions: meal.strInstructions
        };

        let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
        recipes.push(recipe);
        localStorage.setItem('recipes', JSON.stringify(recipes));

        loadRecipes();
    } catch (error) {
        console.error('Error fetching random recipe:', error);
    }
}
