import axios from 'axios';

import { food2forkAPIKey as key } from '../../api.js';

// Global app controller

async function getResults(query) {
  const proxy = 'https://cors-anywhere.herokuapp.com/';

  try {
    const result = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${query}`);
    const recipes = result.data.recipes;
    console.log(recipes);
  } catch (e) {
    alert(e);
  } // catch
} // getResults

getResults('pasta');
