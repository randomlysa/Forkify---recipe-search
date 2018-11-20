import Swiper from 'swiper';

// Global app controller

import List from './models/List';


import * as listView from './views/listView';
import * as likesView from './views/likesView';
import * as base from './views/base';

import state from './utils/state';
import { controlSearchFromState } from './controllers/searchController';
import { controlRecipe } from './controllers/recipeController';
import { getLikesFromLocalStorage } from './controllers/likeController';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 * - Swiper
*/




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
