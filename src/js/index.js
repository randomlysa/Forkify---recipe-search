// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';

import * as searchView from './views/searchView';
import { elements, renderLoader, removeLoader } from './views/base';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
*/
const state = {};

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

    // Search for recipes.
    await state.search.getResults();

    // Render results on the UI.
    // console.log(state.search.result);
    removeLoader();
    searchView.renderResults(state.search.result);
  }
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
const r = new Recipe('47923');
r.getRecipe();
console.log(r)
