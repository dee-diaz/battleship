import Ship from './Ship';

export const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
export const COLS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const SHIPS = {
  CARRIER: 'carrier',
  BATTLESHIP: 'battleship',
  CRUISER: 'cruiser',
  SUBMARINE: 'submarine',
  DESTROYER: 'destroyer',
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
    // ship of length 2
    const coord = `${x}-${y}`;
    if (this.grid.get(coord) === 1 && orientation === 'vertical') {
      const currIndex = ROWS.indexOf(x);
      const nextRow = ROWS[currIndex + 1];

      if (this.grid.get(`${nextRow}-${y}`) === 1) {
        this.grid.set(coord, ship);
        this.grid.set(`${nextRow}-${y}`, ship);
        return [coord, `${nextRow}-${y}`];
      }
    }
  }

  // placeShip(ship) {}
}

export default Gameboard;
