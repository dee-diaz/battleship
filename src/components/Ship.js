class Ship {
  constructor(length, name) {
    this.length = length;
    this.name = name;
    this._numOfHits = 0;
    this._isSunk = false;
  }

  hit() {
    if (this._isSunk || this._numOfHits >= this.length) return null;
    this._numOfHits++;
    return this._numOfHits;
  }

  isSunk() {
    if (this.length > this._numOfHits) return false;
    this._isSunk = true;
    return true;
  }
}

export default Ship;
