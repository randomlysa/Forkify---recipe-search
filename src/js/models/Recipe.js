import axios from 'axios';
import { food2forkAPIKey as key, proxy } from '../../../src/js/config';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    console.log(this);
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
    }
  } // getRecipe
} // Recipe class
