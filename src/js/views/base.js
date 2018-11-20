export const elements = {
  searchForm: document.querySelector('.search'),
  searchInput: document.querySelector('.search__field'),
  searchResultsDiv: document.querySelector('.results'),
  searchResultList: document.querySelector('.results__list'),
  searchResultsPages: document.querySelector('.results__pages'),
  recipe: document.querySelector('.recipe'),
  shoppingDiv: document.querySelector('.shopping'),
  shopping: document.querySelector('.shopping__list'),
  likesMenu: document.querySelector('.likes__field'),
  likesList: document.querySelector('.likes__list'),
  likesRemoveAll: document.querySelector('.likes__removeall'),
  notifications: document.querySelector('.notifications'),
  notificationsText: document.querySelector('.notifications__text'),
  showResults: document.querySelector('.menu__results'),
  showRecipe: document.querySelector('.menu__recipe'),
  showCart: document.querySelector('.menu__cart'),
  menu: document.querySelector('.menu')
};

export const elementStrings = {
  loader: 'loader'
};

export const renderLoader = parentElement => {
  const loader = `
    <div class="${elementStrings.loader}">
      <svg>
        <use href="img/icons.svg#icon-cw"></use>
      </svg>
    </div>
  `;
  parentElement.insertAdjacentHTML('afterbegin', loader);
}

export const removeLoader = () => {
  const loader = document.querySelector(`.${elementStrings.loader}`);
  if (loader) loader.parentElement.removeChild(loader);
};

export const showNotificationMessage = message => {
  elements.notificationsText.innerHTML= '';
  elements.notificationsText.insertAdjacentHTML('afterbegin', message);
};

export const hideNotificationMessage = () => {
  elements.notificationsText.innerHTML= '';
};
