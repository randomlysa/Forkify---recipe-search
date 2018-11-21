import Recipe from '../models/Recipe';
import List from '../models/List';
import state from '../utils/state';
import * as recipeView from '../views/recipeView';
import * as searchView from '../views/searchView';
import * as listView from '../views/listView';
import * as base from '../views/base';
import { controlLike } from './likeController';

// Recipe controller.
export const controlRecipe = async () => {
  // Get ID from url hash.
  const id = window.location.hash.replace('#', '');

  // An id was found, load the recipe.
  if (id) {

    // Switch to recipe slide. Use goTo because it marks 'Recipe' as the
    // active item in the menu.
    state.goTo(1)

    // Prepare the UI for changes.
    recipeView.removeRecipe();
    base.renderLoader(base.elements.recipe);

    if (state.search) searchView.highlightSelected(id)

    // Create new recipe object.
    state.recipe = new Recipe(id);

    try {
      // Hide notification if it exists.
      base.hideNotificationMessage();

      // Get recipe data and parse ingredients.
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      // Check if ingredients exist. If not, don't try to render the recipe.
      if (!state.recipe.ingredients) {
        throw 'No ingredients found - incorrect recipe ID or error parsing \
          ingredients?';
      }

      // Calculate servings and time.
      state.recipe.calcServings();
      state.recipe.calcTime();

      // Remove loader image and render the recipe.
      base.removeLoader();
      recipeView.renderRecipe(
        state.recipe,
        state.likes.isLiked(id)
      );

    } catch (error) {
      console.log(error);
      base.showNotificationMessage('There was an error loading the recipe.');
    }
  } else { // if (id)
    // Show a message saying 'nothing here.'
    recipeView.renderRecipe();
  }

};

// Handling recipe button clicks: increase/decrease servings, add items to
// shopping list.
base.elements.recipe.addEventListener('click', e => {
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
base.elements.shopping.addEventListener('click', e => {
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
