// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';

import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, removeLoader } from './views/base';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
*/
const state = {};

// Search Controller
const controlSearch = async () => {
  // Get the query from the view.
  const query = searchView.getInput();

  if (query) {
    // Create a new search object and add it to state.
    state.search = new Search(query);

    // Prepare the UI for results.
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchResultsDiv);

    try {
      // Search for recipes.
      await state.search.getResults();

      // Render results on the UI.
      // console.log(state.search.result);
      removeLoader();
      searchView.renderResults(state.search.result);
    } catch (error) {
      removeLoader();
      alert('Error searching');
    }
  } //
}

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResultsPages.addEventListener('click', e => {
  // Find the button that was clicked.
  const button = e.target.closest('.btn-inline');
  if (button) {
    // Get the page number associated with the button.
    const goToPage = parseInt(button.dataset.goto, 10);
    // Clear recipe list and pagination buttons.
    searchView.clearResults();
    // Render results for page 'goToPage.'
    searchView.renderResults(state.search.result, goToPage);
  }
})


// Recipe controller.
const controlRecipe = async () => {
  // Get ID from url hash.
  const id = window.location.hash.replace('#', '');

  if (id) {
    // Prepare the UI for changes.
    recipeView.removeRecipe();
    renderLoader(elements.recipe);

    if (state.search) searchView.highlightSelected(id)

    // Create new recipe object.
    state.recipe = new Recipe(id);

    try {
      // Get recipe data and parse ingredients.
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      // Calculate servings and time.
      state.recipe.calcServings();
      state.recipe.calcTime();

      // Render the recipe.
      removeLoader();
      recipeView.renderRecipe(
        state.recipe,
        state.likes.isLiked(id)
      );

    } catch (error) {
      console.log(error);
      alert('Error loading recipe.');
    }
  }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// List Controller
const controlList = () => {
  // Create a new list if there is none yet.
  if (!state.list) state.list = new List();

  // Add all ingredients to the list and UI.
  state.recipe.ingredients.map(ingredient => {
    const item = state.list.addItem(
      ingredient.count,
      ingredient.unit,
      ingredient.ingredient
    );
    listView.renderItem(item);
  });
}

// Handle delete and update list item events.
elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  // Handle delete button.
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    // Delete from state.
    state.list.deleteItem(id);

    // Delete from UI.
    listView.deleteItem(id);

  // Handle count update.
  } else if (e.target.matches('.shopping__count--value')) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

// Like Controller
// TESTING. Until localstorage is implemented.
state.likes = new Likes();
likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
// END TESTING.

const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentId = state.recipe.id;

  // User has not liked current recipe.
  if (!state.likes.isLiked(currentId)) {
    // Add like to the state.
    const newLike = state.likes.addLike(
      currentId,
      state.recipe.title,
      state.recipe.recipe,
      state.recipe.img
    );

    // Toggle the like button.
    likesView.toggleLikeButton(true);


    // Add like to the UI list.
    console.log(state.likes);

  // User has liked current recipe.
  } else {
    // Remove like from the state.
    state.likes.deleteLike(currentId);

    // Toggle the like button.
    likesView.toggleLikeButton(false);

    // Remove like from the UI list.
    console.log(state.likes);
  }

  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
}

// Handling recipe button clicks.
elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    // Decrease button is clicked.
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    // Increase button is clicked.
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    // Add ingredients to shopping list.
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    // Like controller.
    controlLike();
  }
});
