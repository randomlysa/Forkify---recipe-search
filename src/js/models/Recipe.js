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

    const newIngredients = this.ingredients.map(item => {
      // Uniform units.
      let ingredient = item.toLowerCase();
      unitsLong.forEach((unit, index) => {
        ingredient = ingredient.replace(unit, unitsShort[index]);
      });

      // Remove parenthesis.
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

      // Parse ingredients into count, unit, and ingredient.
      const arrIng = ingredient.split(' ');
      const unitIndex = arrIng.findIndex(item2 => unitsShort.includes(item2));

      let objectIngredient;
      if (unitIndex > -1) {
        // There is a unit.
        // 4 1/2 cups --- arrayCount =  [4, 1/2].
        // 4 cups     --- arrayCount =  [4].
        const arrayCount = arrIng.slice(0, unitIndex);
        let count;
        if (arrayCount.length === 1) {
          count = eval(arrIng[0].replace('-', '+'));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join('+'));
        }

        objectIngredient = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(' ')
        };
      } else if (parseInt(arrIng[0], 10)) {
        // There is no unit but first element is a number.
        objectIngredient = {
          count: parseInt(arrIng[0], 10),
          unit: '',
          ingredient: arrIng.slice(1).join(' ')
        };
      } else if (unitIndex === -1) {
        // There is no unit.
        objectIngredient = {
          count: 1,
          unit: '',
          ingredient
        };
      }
      return objectIngredient;
    }); // this.ingredients.map

    this.ingredients = newIngredients;
  }

} // Recipe class
