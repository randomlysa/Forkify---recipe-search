import { elements } from './base';

// One line arrow function = implicit return.
export const getInput = () => elements.searchInput.value;

// Clear searchInput of whatever text was searched for.
export const clearInput = () => {
  elements.searchInput.value = '';
};

// Remove recipes. Used before adding new recipes to the list.
export const clearResults = () => {
  elements.searchResultList.innerHTML = '';
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
      <a class="results__link" href="${recipe.recipe_id}">
          <figure class="results__fig">
              <img src="${recipe.img_url}" alt="${recipe.title}">
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

export const renderResults = recipes => {
  recipes.forEach(renderRecipe);
};
