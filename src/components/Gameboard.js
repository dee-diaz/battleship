import Ship from './Ship';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'G'];
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
  }

  #buildGrid(size = 10) {
    const map = new Map();

    ROWS.forEach((row) => {
      for (let i = 1; i <= size; i++) {
        const key = [row, i];
        map.set(key, 1);
      }
    });

    return map;
  }

  createFleet() {
    const fleet = new Map();
    fleet.set(SHIPS.CARRIER, new Ship(5));
    fleet.set(SHIPS.BATTLESHIP, new Ship(4));
    fleet.set(SHIPS.CRUISER, new Ship(3));
    fleet.set(SHIPS.SUBMARINE, new Ship(3));
    fleet.set(SHIPS.DESTROYER, new Ship(2));
    return fleet;
  }
}

export default Gameboard;
