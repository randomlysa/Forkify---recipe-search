import axios from 'axios';

import { food2forkAPIKey as key } from '../../../api.js';

export default class Search {
  // Constructor method. Called immediately.
  constructor(query) {
    this.query = query;
  }

  // Async method of this class.
  async getResults() {
    const proxy = 'https://cors-anywhere.herokuapp.com/';

    try {
      const result = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
      this.result = result.data.recipes;
      // console.log(this.result);
    } catch (e) {
      alert(e);
    } // catch
  } // async getResults
} // default class Search
