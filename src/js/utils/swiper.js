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

  // Update active menu item when swiping.
  mySwiper.on('slideChange', () => {
    updateActiveMenuItem(mySwiper.activeIndex);
  })

  // Switch slides. Runs when a recipe is searched for (goTo 0) or when a recipe
  // is clicked (goTo 1.)
  const goTo = (slide) => {
    mySwiper.slideTo(slide);
    updateActiveMenuItem(slide);
  }; // const goTo = (slide) =>

  // Update active menu item. Currently puts a dark yellow border under it.
  const updateActiveMenuItem = (activeSlide) => {
    // Select all recipe links.
    const allMenuLinks = Array.from(document.querySelectorAll(`.breadcrumb__title`));

    // Remove active class from all.
    allMenuLinks.forEach(link => link.classList.remove('breadcrumb--active'));

    // Add active class to link that has a data-menu = activeSlide.
    const currentLink = document.querySelector(
      `.breadcrumb__title[data-menu='${activeSlide}']`
    );
    // currentLink should always exist but check anyway.
    if (currentLink) currentLink.classList.add('breadcrumb--active');
  };

  // Set up click handling on menu.
  base.elements.showResults.addEventListener('click', () => goTo(0));
  base.elements.showRecipe.addEventListener('click', () => goTo(1));
  base.elements.showCart.addEventListener('click', () => goTo(2));

  // Mark the menu item for the slide the page loaded on.
  updateActiveMenuItem(initialSlide);

  // Add goTo to state.
  state.goTo = goTo;
};
