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

// Highlight the current recipe in the recipe list.
export const highlightSelected = id => {
  // Select all recipe links.
  const allLinks = Array.from(document.querySelectorAll(`.results__link`));
  // Remove active class from all.
  allLinks.forEach(link => {
    link.classList.remove('results__link--active');
  });
  // Add active class to link that has a href that equals the current id.
  const currentLink = document.querySelector(`.results__link[href='#${id}']`);
  // currentLink doesn't exist if the recipe id doesn't exist.
  if (currentLink) currentLink.classList.add('results__link--active');

}

const renderRecipe = recipe => {
  const markup = `
    <li>
      <a class="results__link" data-rid="${recipe.recipe_id}" href="#${recipe.recipe_id}">
          <figure class="results__fig">
              <img src="${recipe.image_url}" alt="${recipe.title}">
          </figure>
          <div class="results__data">
              <h4 class="results__name">${recipe.title}</h4>
              <p class="results__author">${recipe.publisher}</p>
          </div>
      </a>
    </li>
  `;

  elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

const renderError = () => {
  const markup = `<li><h4 class="results__noresults">No results found, sorry!</h4></li>`;

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

  // No recipes found.
  if (recipes.length === 0) {
    renderError();
  } else {
    // Render (partial) list of recipies.
    recipes.slice(start, end).forEach(renderRecipe);

    // Render buttons.
    renderButtons(page, recipes.length, resultsPerPage);
  }
};
