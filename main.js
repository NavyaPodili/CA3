function fetchRandomRecipeData() {
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
      .then(response => response.json())
      .then(data => {
        const recipeData = data.meals[0];
        renderRecipeCard(recipeData);
      })
      .catch(error => {
        console.error('Error fetching random recipe:', error);
      });
  }
  
  function renderRecipeCard(recipe) {
    const recipeContainer = document.getElementById('recipeContent');
    recipeContainer.innerHTML = `
      <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
      <p>${recipe.strMeal}</p>
    `;
  
    recipeContainer.addEventListener('click', () => {
      displayRecipeIngredients(recipe);
    });
  }
  
  function displayRecipeIngredients(recipe) {
    const ingredientList = getIngredientList(recipe);
    const modalHTML = `
      <div class="modal">
        <div class="modal-content">
          <span class="close">&times;</span>
          <h3>${recipe.strMeal}</h3>
          <ul>${ingredientList}</ul>
        </div>
      </div>
    `;
  
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = document.querySelector('.modal');
  
    modal.addEventListener('click', event => {
      if (event.target === modal || event.target.classList.contains('close')) {
        modal.remove();
      }
    });
  }
  
  function getIngredientList(recipe) {
    let ingredientList = '';
  
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
  
      if (ingredient && ingredient.trim() !== '') {
        ingredientList += `<li>${ingredient} - ${measure}</li>`;
      }
    }
  
    return ingredientList;
  }
  
  function fetchSearchedCategoryData(category) {
     const apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
  
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const searchedRecipesContainer = document.getElementById('searchedRecipe');
        searchedRecipesContainer.innerHTML = '';
  
        if (data.meals) {
          data.meals.forEach(recipe => {
            searchedRecipesContainer.innerHTML += `
              <div class="meal">
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                <p>${recipe.strMeal}</p>
              </div>
            `;
          });
        } else {
          searchedRecipesContainer.innerHTML = '<p>No recipes found for this category.</p>';
        }
  
        document.getElementById('searchedCategories').classList.remove('hidden');
      })
      .catch(error => {
        console.error('Error in fetching searched category:', error);
      });
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    fetchRandomRecipeData();
  
    document.getElementById('searchButton').addEventListener('click', () => {
      const searchInputValue = document.getElementById('searchInput').value.trim();
  
      if (searchInputValue !== '') {
        fetchSearchedCategoryData(searchInputValue);
      } else {
        console.log('Please enter the recipe to search!!');
      }
    });
  });
