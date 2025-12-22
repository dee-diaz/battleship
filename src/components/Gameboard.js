import Ship from './Ship';

export const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export const SHIPS = {
  CARRIER: 'carrier',
  BATTLESHIP: 'battleship',
  CRUISER: 'cruiser',
  SUBMARINE: 'submarine',
  DESTROYER: 'destroyer',
};
export const AXIS = {
  X: 'x',
  Y: 'y',
};

class Gameboard {
  constructor() {
    this.grid = this.#buildGrid();
    this._fleet = this.createFleet();
  }

  #buildGrid(size = 10) {
    const map = new Map();

    ROWS.forEach((row) => {
      for (let i = 1; i <= size; i++) {
        const key = `${row}-${i}`;
        map.set(key, 1);
      }
    });

    return map;
  }

  createFleet() {
    const fleet = new Map();
    fleet.set(SHIPS.CARRIER, new Ship(5, SHIPS.CARRIER));
    fleet.set(SHIPS.BATTLESHIP, new Ship(4, SHIPS.BATTLESHIP));
    fleet.set(SHIPS.CRUISER, new Ship(3, SHIPS.CRUISER));
    fleet.set(SHIPS.SUBMARINE, new Ship(3, SHIPS.SUBMARINE));
    fleet.set(SHIPS.DESTROYER, new Ship(2, SHIPS.DESTROYER));
    return fleet;
  }

  _placeShipAt(ship, x, y, orientation) {
    if (y > 10 || y < 1 || !ROWS.includes(x))
      throw new Error('Enter correct coordinates!');

    if (orientation !== AXIS.X && orientation !== AXIS.Y)
      throw new Error('Invalid orientation');

    if (this.grid.get(`${x}-${y}`) !== 1) throw new Error("Can't place here.");

    if (ROWS.indexOf(x) > 10 - ship.length || y - 1 > 10 - ship.length)
      throw new Error('Out of bounds.');

    let coords = [];
    let allEmpty = true;
    let currCoord = `${x}-${y}`;

    // Check first
    for (let i = 0; i < ship.length; i++) {
      if (this.grid.get(currCoord) !== 1) {
        allEmpty = false;
        break;
      }

      let [currentRow, currentCol] = currCoord.split('-');
      currentCol = parseInt(currentCol);

      let neighbors = [
        `${currentRow}-${currentCol - 1}`,
        `${currentRow}-${currentCol + 1}`,
        `${ROWS[ROWS.indexOf(currentRow) - 1]}-${currentCol}`,
        `${ROWS[ROWS.indexOf(currentRow) + 1]}-${currentCol}`,
      ];

      // Adjacent placement check
      for (let neighbor of neighbors) {
        if (typeof this.grid.get(neighbor) === 'string')
          throw new Error("Can't place here.");
      }

      if (orientation === AXIS.Y) {
        let nextRowIndex = ROWS.indexOf(currentRow) + 1;
        currCoord = `${ROWS[nextRowIndex]}-${currentCol}`;
      } else {
        currCoord = `${currentRow}-${currentCol + 1}`;
      }
    }

    // Add then
    if (allEmpty) {
      currCoord = `${x}-${y}`;
      let currIndex = ROWS.indexOf(x);
      let currCol = y;

      for (let i = 0; i < ship.length; i++) {
        coords.push(currCoord);
        this.grid.set(currCoord, ship.name);
        if (orientation === AXIS.Y) {
          currCoord = `${ROWS[currIndex + 1]}-${y}`;
          currIndex++;
        } else {
          currCoord = `${x}-${currCol + 1}`;
          currCol++;
        }
      }
    }

    return coords;
  }

  // placeShip(ship) {}
}

export default Gameboard;
