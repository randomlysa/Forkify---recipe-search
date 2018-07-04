import { elements } from './base';

// One line arrow function = implicit return.
export const getInput = () => elements.searchInput.value;

// Clear searchInput of whatever text was searched for.
export const clearInput = () => {
  elements.searchInput.value = '';
};

// Remove recipes. Used before adding new recipes to the list.
export const clearResults = () => {
  // Remove list of recipes.
  elements.searchResultList.innerHTML = '';
  // Remove pagination buttons.
  elements.searchResultsPages.innerHTML = '';
};

// Keep title from overflowing to the next line, but also don't
// use partial words - only words that fit fully.
const shortenRecipeTitle = (title, limit = 17) => {
  const newTitle = [];

  if (title.length > limit) {
    title.split(' ').reduce((acc, current) => {
      if (acc + current.length <= limit) {
        newTitle.push(current);
      }
      return acc + current.length;
    }, 0);

    // Return the result.
    return `${newTitle.join(' ')} ...`;
  };
  return title;
};

const renderRecipe = recipe => {
  const markup = `
    <li>
      <a class="results__link" href="#${recipe.recipe_id}">
          <figure class="results__fig">
              <img src="${recipe.image_url}" alt="${recipe.title}">
          </figure>
          <div class="results__data">
              <h4 class="results__name">${shortenRecipeTitle(recipe.title)}</h4>
              <p class="results__author">${recipe.publisher}</p>
          </div>
      </a>
    </li>
  `;

  elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

const createButton = (currentPage, buttonType) => `
  <button
    class="btn-inline results__btn--${buttonType}"
    data-goto=${buttonType === 'prev' ? currentPage - 1 : currentPage + 1}
  >
      <svg class="search__icon">
          <use
            href="img/icons.svg#icon-triangle-${buttonType === 'prev' ? 'left' : 'right'}">
          </use>
      </svg>
      <span>
        Page ${buttonType === 'prev' ? currentPage - 1 : currentPage + 1}
      </span>
  </button>
`;

/**
 * Page: starting page
 * numberOfResults: totalNumberOfResults
*/
const renderButtons = (page, numberOfResults, resultsPerPage) => {
  const totalNumberOfPages = Math.ceil(numberOfResults / resultsPerPage);

  // Add HTML for the button to this variable.
  let button;
  if (page === 1 && totalNumberOfPages > 1) {
    // Button for next page.
    button = createButton(page, 'next');
  } else if (page < totalNumberOfPages) {
    // Button for both pages.
    button = `
      ${createButton(page, 'next')}
      ${createButton(page, 'prev')}
    `;
  } else if (page === totalNumberOfPages && numberOfResults > 1) {
    // Button for previous page.
    button = createButton(page, 'prev');
  }

  // Add button(s) to the page.
  elements.searchResultsPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resultsPerPage = 10) => {
  const start = (page - 1) * resultsPerPage;
  const end = page * resultsPerPage;

  // Render (partial) list of recipies.
  recipes.slice(start, end).forEach(renderRecipe);

  // Render buttons.
  renderButtons(page, recipes.length, resultsPerPage);
};
