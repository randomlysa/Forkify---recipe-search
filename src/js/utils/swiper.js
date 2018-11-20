import Swiper from 'swiper';
import state from '../utils/state';
import * as base from '../views/base';

export const setupSwiper = () => {
  // Check for an id.
  let initialSlide;
  const id = window.location.hash.replace('#', '');

  // Set initial slide.
  if (id) initialSlide = 1;
  else initialSlide = 0;

  // Initialize swiper on page load.
  const mySwiper = new Swiper ('.swiper-container', {
    direction: 'horizontal',
    centeredSlides: true,
    initialSlide: initialSlide
  });

  const goTo = (slide) => {
    state.currentSlide = slide;
    mySwiper.slideTo(slide);

    // Select all recipe links.
    const allMenuLinks = Array.from(document.querySelectorAll(`.breadcrumb__title`));

    // Remove active class from all.
    allMenuLinks.forEach(link => link.classList.remove('breadcrumb--active'));

    // Add active class to link that has a data-menu = state.currentSlide.
    const currentLink = document.querySelector(
      `.breadcrumb__title[data-menu='${state.currentSlide}']`
    );
    // currentLink doesn't exist if the recipe id doesn't exist.
    if (currentLink) currentLink.classList.add('breadcrumb--active');
  }; // const goTo = (slide) =>

  // Set up click handling on menu.
  base.elements.showResults.addEventListener('click', () => goTo(0));
  base.elements.showRecipe.addEventListener('click', () => goTo(1));
  base.elements.showCart.addEventListener('click', () => goTo(2));

  // Use goTo to mark item in menu. The page should have already loaded on this
  // slide.
  if (id) goTo(1);
  else goTo(0);

  // Add goTo to state.
  state.goTo = goTo;
};
