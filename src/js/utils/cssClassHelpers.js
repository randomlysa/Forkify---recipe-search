import * as base from '../views/base';
import * as h from  '../utils/cssClassHelpers';

// by default, hide everything (just for fun ~)
// https://www.sitepoint.com/dom-manipulation-vanilla-javascript-no-jquery/

export const setupInitialPage = () => {
  if (window.innerWidth < 800) {
    base.elements.searchResultsDiv.classList.add('collapsed');
    base.elements.shoppingDiv.classList.add('collapsed');

    // Set up click handlers for mobile menu.
    base.elements.showResults.addEventListener('click', h.showResults);
    base.elements.showRecipe.addEventListener('click', h.showRecipe);
    base.elements.showCart.addEventListener('click', h.showCart);

  }
  // Hide menu that toggles between results, receipt, and cart.
  if (window.innerWidth > 800) {
    base.elements.menu.classList.add('collapsed');
  }
}

export const showResults = () => {

  if (window.innerWidth < 800) {
    base.elements.searchResultsDiv.classList.remove('collapsed');
    base.elements.recipe.classList.add('collapsed');
    base.elements.shoppingDiv.classList.add('collapsed');
  }
};

export const showRecipe = () => {
  if (window.innerWidth < 800) {
    base.elements.searchResultsDiv.classList.add('collapsed');
    base.elements.recipe.classList.remove('collapsed');
    base.elements.shoppingDiv.classList.add('collapsed');
  }
};

export const showCart = () => {
  if (window.innerWidth < 800) {
    base.elements.searchResultsDiv.classList.add('collapsed');
    base.elements.recipe.classList.add('collapsed');
    base.elements.shoppingDiv.classList.remove('collapsed');
  }
};
