class Ship {
  constructor(length) {
    this.length = length;
    this.numOfHits = 0;
    this.isSunk = false;
  }

  hit() {
    if (this.isSunk || this.numOfHits > this.length) return null;
    this.numOfHits++;
    return this.numOfHits;
  }
}

export default Ship;
