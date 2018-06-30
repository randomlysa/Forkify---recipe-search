export const elements = {
  searchForm: document.querySelector('.search'),
  searchInput: document.querySelector('.search__field'),
  searchResultsDiv: document.querySelector('.results'),
  searchResultList: document.querySelector('.results__list')
};

export const renderLoader = parentElement => {
  const loader = `
    <div class="loader">
      <svg>
        <use href="img/icons.svg#icon-cw"></use>
      </svg>
    </div>
  `;
  parentElement.insertAdjacentHTML('afterbegin', loader);
}