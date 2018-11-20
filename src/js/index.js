import Swiper from 'swiper';

// Global app controller

import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';

import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import * as base from './views/base';

import state from './utils/state';
import { controlSearch, controlSearchFromState } from './controllers/searchController';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 * - Swiper
*/

// Recipe controller.
const controlRecipe = async () => {
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
  }
};

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

// Like Controller
const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentId = state.recipe.id;

  // User has not liked current recipe.
  if (!state.likes.isLiked(currentId)) {
    // Add like to the state.
    const newLike = state.likes.addLike(
      currentId,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );

    // Toggle the like button.
    likesView.toggleLikeButton(true);

    // Add like to the UI list.
    // TODO does this matter if it is newLike or state.recipe?
    likesView.renderLike(newLike);

  // User has liked current recipe.
  } else {
    // Remove like from the state.
    state.likes.deleteLike(currentId);

    // Toggle the like button.
    likesView.toggleLikeButton(false);

    // Remove like from the UI list.
    likesView.deleteLike(currentId);
  }

  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
}

// Read and render likes from localStorage.
const getLikesFromLocalStorage = () => {
  state.likes = new Likes();
  state.likes.readDataFromLocalStorage();

  // Toggle the button.
  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
  // Add items to likes list.
  state.likes.likes.forEach(like => likesView.renderLike(like));
};

// Delete all likes.
// TODO: this doesn't remove the 'heart' that opens the menu or toggle the
// 'heart' in the individual (open) recipe.
base.elements.likesRemoveAll.addEventListener('click', () => {
  const allLikes = document.querySelectorAll(".likes__link");
  Array.from(allLikes).forEach(like => {
    if (like.href.includes('#')) {
      state.likes.deleteLike(like.href.split('#')[1]);
      likesView.deleteLike(like.href.split('#')[1]);
    } else {
      console.log('Error - hash not found in url', like);
    }
  }); // Array.from
});


// Handling recipe button clicks.
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



// Read search from storage and update UI if items exist in storage.
const readSearchFromLocalStorage = () => {
  const storage = JSON.parse(localStorage.getItem('recipe-search'));

  // Restore search if storage exists.
  if (storage) {
    state.search = storage;
    controlSearchFromState();
  }
} // readSearchFromLocalStorage

// Handle clicks on results > recipes.
base.elements.searchResultList.addEventListener('click', (e) => {
  const clickArea = e.target.closest('.results__link');
  const recipeId = clickArea.dataset.rid;
  console.log(recipeId)
});

const setupSwiper = () => {
  // Check for an id.
  let initialSlide;
  const id = window.location.hash.replace('#', '');

  // Set initial slide.
  if (id) initialSlide = 1
  else initialSlide = 0

  // Initialize swiper on page load.
  const mySwiper = new Swiper ('.swiper-container', {
    direction: 'horizontal',
    centeredSlides: true,
    initialSlide: initialSlide
  });

  const goTo = (slide) => {
    state.currentSlide = slide;
    mySwiper.slideTo(slide);

    // Select all recipe links.
    const allMenuLinks = Array.from(document.querySelectorAll(`.breadcrumb__title`));

    // Remove active class from all.
    allMenuLinks.forEach(link => link.classList.remove('breadcrumb--active'));

    // Add active class to link that has a data-menu = state.currentSlide.
    const currentLink = document.querySelector(
      `.breadcrumb__title[data-menu='${state.currentSlide}']`
    );
    // currentLink doesn't exist if the recipe id doesn't exist.
    if (currentLink) currentLink.classList.add('breadcrumb--active');
  } // const goTo = (slide) =>

  // Set up click handling on menu.
  base.elements.showResults.addEventListener('click', () => goTo(0));
  base.elements.showRecipe.addEventListener('click', () => goTo(1));
  base.elements.showCart.addEventListener('click', () => goTo(2));

  // Use goTo to mark item in menu. The page should have already loaded on this
  // slide.
  if (id) goTo(1)
  else goTo(0)

  // Add swiper to state.
  state.goTo = goTo;
};

// init functions below.
// Set up swiper.
window.addEventListener('load', setupSwiper)
// Search: Read/load state.search from storage on page load.
window.addEventListener('load', readSearchFromLocalStorage);
// Likes: Load likes from storage.
window.addEventListener('load', getLikesFromLocalStorage);
// Recipe: Load recipe on hashchange and pageload.
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
