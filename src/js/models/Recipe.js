import axios from 'axios';
import { food2forkAPIKey as key, proxy } from '../../../src/js/config';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const result = await axios(`${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`);

      const recipeInfo = result.data.recipe;
      this.title = recipeInfo.title;
      this.author = recipeInfo.publisher;
      this.img = recipeInfo.image_url;
      this.url = recipeInfo.source_url;
      this.ingredients = recipeInfo.ingredients;

    } catch (error) {
      console.log(error);
      alert("Something went wrong...");
    }
  } // getRecipe

  calcTime() {
    // Assuming 15 minutes per 3 ingredients.
    const numberOFIngredients = this.ingredients.length;
    const periods = Math.ceil(numberOFIngredients / 3);
    this.time = periods * 15;
  };

  calcServings() {
    this.servings = 4;
  }

  parseIngredients() {
    // Search for:
    const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce',
      'teaspoons', 'teaspoon', 'cups', 'pounds', 'kilogram', 'gram'];
    // Replace with:
    const unitsShort = ['tbps', 'tbps', 'oz', 'oz', 'tsp', 'tsp', 'cup',
      'pound', 'kg', 'g'];

    // Search for 'one' and replace with '1', etc.
    const numbersInWords = ['one', 'two', 'three', 'four', 'five', 'six',
      'seven', 'eight', 'nine', 'ten'];
    const numbersInInt = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const newIngredients = this.ingredients.map(item => {

      // Uniform units.
      let ingredient = item.toLowerCase();
      unitsLong.forEach((unit, index) => {
        ingredient = ingredient.replace(unit, unitsShort[index]);
      });

      // Remove parenthesis.
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

      // Used to parse ingredients into count, unit, and ingredient.
      const arrIng = ingredient.split(' ');

      // Convert word numbers to int. Works with id 47744.
      // Example: one small handful of raw pine nuts --> 1 small handful...
      const wordNumberIndex = arrIng.findIndex(item3 => numbersInWords.includes(item3));
      if (wordNumberIndex > -1 ) arrIng[wordNumberIndex] = numbersInInt[wordNumberIndex];

      // Parse ingredients into count, unit, and ingredient.
      const unitIndex = arrIng.findIndex(item2 => unitsShort.includes(item2));

      let objectIngredient;
      if (unitIndex > -1 && wordNumberIndex > -1) {
        // CASE 1 ------------ There is a unit.
        // 4 1/2 cups --- arrayCount =  [4, 1/2].
        // 4 cups     --- arrayCount =  [4].
        const arrayCount = arrIng.slice(0, unitIndex);
        let count;

        if (arrayCount.length === 1) {
          count = eval(arrIng[0].replace('-', '+'));
        } else {
          count = eval(arrIng.slice(unitIndex - 1, unitIndex).join('+'));
        }

        objectIngredient = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(' ')
        };
      } else if (parseInt(arrIng[0], 10)) {
        // CASE 2 ------------ There is no unit but first element is a number.
        objectIngredient = {
          count: parseInt(arrIng[0], 10),
          unit: '',
          ingredient: arrIng.slice(1).join(' ')
        };
      } else if (unitIndex === -1) {
        // CASE 3 ------------ There is no unit.
        objectIngredient = {
          count: 1,
          unit: '',
          ingredient
        };
      } else {
        // CASE 4 ------------ There is a unit but no number,
        //                     or some other situation. (ID: 47744)
        objectIngredient = {
          count: '',
          unit: '',
          ingredient
        };
      } // else

      return objectIngredient;
    }); // this.ingredients.map

    this.ingredients = newIngredients;
  }

  updateServings (type) {
    // Servings.
    const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

    // Ingredients.
    this.ingredients.forEach(ingredient => {
      ingredient.count *= (newServings / this.servings);
    });

    this.servings = newServings;
  }

} // Recipe class
