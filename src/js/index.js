// Global app controller
import state from './utils/state';
import { controlSearchFromState } from './controllers/searchController';
import { controlRecipe } from './controllers/recipeController';
import { getLikesFromLocalStorage } from './controllers/likeController';
import { setupSwiper } from './utils/swiper';

import '../css/style.scss';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 * - goTo (function to switch slides)
 */

// Read search from storage and update UI if items exist in storage.
const readSearchFromLocalStorage = () => {
  const storage = JSON.parse(localStorage.getItem('recipe-search'));

  // Restore search if storage exists.
  if (storage) {
    state.search = storage;
  }
  // This will either render the recipes that were in state or show a message
  // that there's nothing here - previously the page was blank on a first run.
  controlSearchFromState();
}; // readSearchFromLocalStorage

// init functions below.
// Set up swiper.
window.addEventListener('load', setupSwiper);
// Search: Read/load state.search from storage on page load.
window.addEventListener('load', readSearchFromLocalStorage);
// Likes: Load likes from storage.
window.addEventListener('load', getLikesFromLocalStorage);
// Recipe: Load recipe on hashchange and pageload.
['hashchange', 'load'].forEach(event =>
  window.addEventListener(event, controlRecipe)
);
