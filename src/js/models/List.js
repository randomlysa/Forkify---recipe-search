import uniqid from 'uniqid';

export default class List {
  constructor() {
    this.items = [];
  }

  addItem (count, unit, ingredient) {
    const item = {
      id: uniqid(),
      count,
      unit,
      ingredient
    };
    this.items.push(item);
    return item;
  } // addItem

  deleteItem(id) {
    const index = this.items.findIndex(item => item.id === id);
    this.items.splice(index, 1);
  } // deleteItem

  updateCount(id, newCount) {
    this.items.find(item => item.id === id).count = newCount;
  } // updateCount
} // export default class List.
