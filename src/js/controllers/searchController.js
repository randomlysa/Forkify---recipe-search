import Search from '../models/Search';

import state from '../utils/state';

import * as base from '../views/base';
import * as searchView from '../views/searchView';

// Search Controller
export const controlSearch = async () => {
  // Get the query from the view.
  const query = searchView.getInput();

  if (query) {
    // Hide previous notification message.
    // TODO: Keep here or only hide on success?
    base.hideNotificationMessage();

    // Create a new search object and add it to state.
    state.search = new Search(query);

    // Prepare the UI for results.
    searchView.clearInput();
    searchView.clearResults();
    base.renderLoader(base.elements.searchResultsDiv);

    try {
      // Search for recipes.
      await state.search.getResults();

      // Render results on the UI.
      base.removeLoader();
      saveSearchToLocalStorage();
      searchView.renderResults(state.search.result);
    } catch (e) {
      console.log(e);
      base.removeLoader();
      base.showNotificationMessage('There was an error searching.');
    }
  } // if (query)
} // controlSearch

export const controlSearchFromState = () => {
  const query = state.search;

  if (query) {
    // Hide previous notification message.
    // TODO: Keep here or only hide on success?
    base.hideNotificationMessage();

    // Prepare the UI for results.
    searchView.clearInput();
    searchView.clearResults();
    base.renderLoader(base.elements.searchResultsDiv);

    try {
      // Render results on the UI.
      base.removeLoader();
      searchView.renderResults(state.search.result);
    } catch (e) {
      console.log(e);
      base.removeLoader();
      base.showNotificationMessage('There was an error searching.');
    } // try/catch
  } // if query
} // controlSearchFromState

// Do a search.
base.elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

// Handle pagination clicks.
base.elements.searchResultsPages.addEventListener('click', e => {
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

// Save search object to storage (search query and results.)
const saveSearchToLocalStorage = () => {
  console.log('saving state', state);
  localStorage.setItem('recipe-search', JSON.stringify(state.search));
} // saveSearchToLocalStorage

// Handle clicks on results > recipes.
base.elements.searchResultList.addEventListener('click', (e) => {
  const clickArea = e.target.closest('.results__link');
  const recipeId = clickArea.dataset.rid;
  console.log(recipeId)
});
