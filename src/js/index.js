// Global app controller
import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements } from './views/base';

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
  console.log(query);

  if (query) {
    // Create a new search object and add it to state.
    state.search = new Search(query);

    // Prepare the UI for results.

    // Search for recipes.
    await state.search.getResults();

    // Render results on the UI.
    console.log(state.search.result);
  }
}

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});
