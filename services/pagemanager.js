const cypher = require("../helpers/crypt");

class PageManager {
  constructor(id, max) {
    this.pageManagerId = cypher(id);
    this.currentPage = 1;
    this.min = 1;
    this.max = max;
  }

  next() {
    if (this.currentPage < this.max) {
      this.currentPage = ++this.currentPage;
      return true;
    }
    return false;
  }
  prev() {
    if (this.currentPage > this.min) {
      this.currentPage = --this.currentPage;
      return true;
    }
    return false;
  }
  setCurrent(value) {
    if (value <= this.max && value >= this.min) {
      this.currentPage = Math.floor(Number(value));
      return true;
    }
    return false
  }
}

module.exports = { PageManager };
