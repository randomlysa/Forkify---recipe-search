import { elements } from './base';

export const toggleLikeButton = isLiked => {
  const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
  document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
};

export const toggleLikeMenu = numLikes => {
  // Toggle the 'heart' that shows the likes menu when hovered over.
  elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
  // Toggle displaying the link to remove all liked recipes.
  elements.likesRemoveAll.style.display = numLikes > 1 ? 'block' : 'none';
};

elements.likesRemoveAll.addEventListener('click', () => {
  const allLikes = document.querySelectorAll(".likes__link");
  Array.from(allLikes).forEach(like => {
    if (like.href.includes('#')) {
      deleteLike(like.href.split('#')[1]);
    } else {
      console.log('Error - hash not found in url', like);
    }
  }); // Array.fron
});

export const renderLike = like => {
  const markup = `
    <li>
      <a class="likes__link" href="#${like.id}">
        <figure class="likes__fig">
            <img src="${like.img}" alt="${like.title}">
        </figure>
        <div class="likes__data">
            <h4 class="likes__name">${like.title}</h4>
            <p class="likes__author">${like.author}</p>
        </div>
      </a>
    </li>
  `;

  elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = id => {
  const item = document.querySelector(`.likes__link[href="#${id}"]`).parentElement;
  if (item) item.parentElement.removeChild(item);
};
