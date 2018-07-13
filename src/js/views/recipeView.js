import { elements } from './base';
import num2fraction from 'num2fraction';

export const removeRecipe = () => {
  elements.recipe.innerHTML = '';
};

const formatCount = count => {
  if (count) {

    const [ int, dec ] = count.toString().split('.').map(number => parseInt(number, 10));

    // Example: 1 --> 1
    if (!dec) return count;

    // Example: 0.5 --> 1/2
    if (int === 0) {
      return num2fraction(count);

    // Example: 2.5 --> 2 1/2
    } else {
      // Get the decimal. Example: 2.5 --> 0.5.
      const fr = num2fraction(count - int);
      const [num, denom] = fr.split('/');
      // If numerator === denominator (example: 1/1), return int + num/denom.
      if (num === denom) return int + (num/denom);
      // Otherwise return a fraction.
      return `${int} ${fr}`;
    }
  } // if count

  return '?';
};

const createIngredientMarkup = ingredient => `
  <li class="recipe__item">
    <svg class="recipe__icon">
        <use href="img/icons.svg#icon-check"></use>
    </svg>
  <div class="recipe__count">${formatCount(ingredient.count)}</div>
    <div class="recipe__ingredient">
        <span class="recipe__unit">${ingredient.unit}</span>
        ${ingredient.ingredient}
    </div>
  </li>
`;

// Pass in isLiked so heart is rendered correctly.
export const renderRecipe = (recipe, isLiked) => {
  const markup = `
    <figure class="recipe__fig">
        <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
        <h1 class="recipe__title">
            <span>${recipe.title}</span>
        </h1>
    </figure>

    <div class="recipe__details">
        <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="img/icons.svg#icon-stopwatch"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
            <span class="recipe__info-text"> minutes</span>
        </div>
        <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="img/icons.svg#icon-man"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
            <span class="recipe__info-text"> servings</span>

            <div class="recipe__info-buttons">
                <button class="btn-tiny btn-decrease">
                    <svg>
                        <use href="img/icons.svg#icon-circle-with-minus"></use>
                    </svg>
                </button>
                <button class="btn-tiny btn-increase">
                    <svg>
                        <use href="img/icons.svg#icon-circle-with-plus"></use>
                    </svg>
                </button>
            </div>
        </div>
        <button class="recipe__love">
            <svg class="header__likes">
                <use href="img/icons.svg#icon-heart${isLiked ? '' :  '-outlined'}"></use>
            </svg>
        </button>
    </div>

    <div class="recipe__ingredients">
        <ul class="recipe__ingredient-list">
            ${recipe.ingredients.map(ingredient => createIngredientMarkup(ingredient)).join('')}
        </ul>

        <button class="btn-small recipe__btn recipe__btn--add">
            <svg class="search__icon">
                <use href="img/icons.svg#icon-shopping-cart"></use>
            </svg>
            <span>Add to shopping list</span>
        </button>
    </div>

    <div class="recipe__directions">
        <h2 class="heading-2">How to cook it</h2>
        <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
        </p>
        <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
            <span>Directions</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-right"></use>
            </svg>
        </a>
    </div>
  `;

  elements.recipe.insertAdjacentHTML('afterbegin', markup);
};

export const updateServingsIngredients = recipe => {
  // Update servings.
  document.querySelector('.recipe__info-data--people').textContent = recipe.servings;

  // Update ingredients.
  const countElements = Array.from(document.querySelectorAll('.recipe__count'));
  countElements.forEach((item, index) => {
    item.textContent = formatCount(recipe.ingredients[index].count);
  });
};
