export default class Likes {
  constructor() {
    this.likes = [];
  }

  addLike(id, title, author, img) {
    const like = {id, title, author, img};
    this.likes.push(like);

    // Save data to localStorage.
    this.saveDataToLocalStorage();

    return like;
  }

  deleteLike(id) {
    const index = this.likes.findIndex(item => item.id === id);
    this.likes.splice(index, 1);

    // Save data to localStorage.
    this.saveDataToLocalStorage();

  } // deleteLike

  isLiked(id) {
    return this.likes.findIndex(el => el.id === id) !== -1;
  }

  getNumberOfLikes() {
    return this.likes.length;
  }

  saveDataToLocalStorage() {
    localStorage.setItem('likes', JSON.stringify(this.likes));
  }

  readDataFromLocalStorage() {
    const storage = JSON.parse(localStorage.getItem('likes'));

    // Restore likes if storage exists.
    if (storage) this.likes = storage;
  }
}
