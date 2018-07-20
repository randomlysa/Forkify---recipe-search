import axios from 'axios';

import { food2forkAPIKey as key, proxy } from '../../../src/js/config';
import { showNotificationMessage } from '../views/base.js';

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
      showNotificationMessage('There was an error searching.');
    } // catch
  } // async getResults
} // default class Search
