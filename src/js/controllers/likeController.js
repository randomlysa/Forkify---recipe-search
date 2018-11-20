import Likes from '../models/Likes';
import state from '../utils/state';
import * as base from '../views/base';
import * as likesView from '../views/likesView';

// Like Controller
export const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentId = state.recipe.id;

  // User has not liked current recipe.
  if (!state.likes.isLiked(currentId)) {
    // Add like to the state.
    const newLike = state.likes.addLike(
      currentId,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );

    // Toggle the like button.
    likesView.toggleLikeButton(true);

    // Add like to the UI list.
    // TODO does this matter if it is newLike or state.recipe?
    likesView.renderLike(newLike);

  // User has liked current recipe.
  } else {
    // Remove like from the state.
    state.likes.deleteLike(currentId);

    // Toggle the like button.
    likesView.toggleLikeButton(false);

    // Remove like from the UI list.
    likesView.deleteLike(currentId);
  }

  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
}

// Read and render likes from localStorage.
export const getLikesFromLocalStorage = () => {
  state.likes = new Likes();
  state.likes.readDataFromLocalStorage();

  // Toggle the button.
  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
  // Add items to likes list.
  state.likes.likes.forEach(like => likesView.renderLike(like));
};

// Delete all likes.
// TODO: this doesn't remove the 'heart' that opens the menu or toggle the
// 'heart' in the individual (open) recipe.
base.elements.likesRemoveAll.addEventListener('click', () => {
  const allLikes = document.querySelectorAll(".likes__link");
  Array.from(allLikes).forEach(like => {
    if (like.href.includes('#')) {
      state.likes.deleteLike(like.href.split('#')[1]);
      likesView.deleteLike(like.href.split('#')[1]);
    } else {
      console.log('Error - hash not found in url', like);
    }
  }); // Array.from
});