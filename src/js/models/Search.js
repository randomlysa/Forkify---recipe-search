import axios from 'axios';

import { food2forkAPIKey as key, proxy } from '../../../src/js/config';

export default class Search {
  // Constructor method. Called immediately.
  constructor(query) {
    this.query = query;
  }

  // Async method of this class.
  async getResults() {
    try {
      const result = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
      this.result = result.data.recipes;
      // console.log(this.result);
    } catch (e) {
      alert(e);
    } // catch
  } // async getResults
} // default class Search
