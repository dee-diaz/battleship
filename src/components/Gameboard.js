import Ship from './Ship';
import { randomInt } from './utils';

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
  #shipPositions;
  constructor() {
    this.grid = this.#buildGrid();
    this.fleet = this.createFleet();
    this.#shipPositions = new Map();
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

  placeShipAt(ship, x, y, orientation, mode) {
    y = parseInt(y);
    if (y > 10 || y < 1 || !ROWS.includes(x))
      throw new Error('Enter correct coordinates!');

    if (orientation !== AXIS.X && orientation !== AXIS.Y)
      throw new Error('Invalid orientation');

    if (this.grid.get(`${x}-${y}`) !== 1) throw new Error("Can't place here.");

    if (orientation === AXIS.X && y + ship.length - 1 > 10) {
      throw new Error('Out of bounds.');
    }

    if (orientation === AXIS.Y && ROWS.indexOf(x) + ship.length > 10) {
      throw new Error('Out of bounds.');
    }

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

        `${ROWS[ROWS.indexOf(currentRow) + 1]}-${currentCol - 1}`,
        `${ROWS[ROWS.indexOf(currentRow) + 1]}-${currentCol + 1}`,
        `${ROWS[ROWS.indexOf(currentRow) - 1]}-${currentCol - 1}`,
        `${ROWS[ROWS.indexOf(currentRow) - 1]}-${currentCol + 1}`,
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
        if (mode === 'placement') this.grid.set(currCoord, ship.name);
        if (orientation === AXIS.Y) {
          currCoord = `${ROWS[currIndex + 1]}-${y}`;
          currIndex++;
        } else {
          currCoord = `${x}-${currCol + 1}`;
          currCol++;
        }
      }
    }

    this.#shipPositions.set(ship.name, coords);
    return coords;
  }

  placeShips() {
    this.fleet.forEach((ship) => {
      let coords = null;
      let attempts = 0;
      const MAX_ATTEMPTS = 200;

      while (!coords && attempts <= MAX_ATTEMPTS) {
        try {
          const randomX = ROWS[randomInt(0, 9)];
          const randomY = randomInt(1, 10);
          const randomAxis = Object.values(AXIS)[randomInt(0, 1)];
          coords = this.placeShipAt(
            ship,
            randomX,
            randomY,
            randomAxis,
            'placement',
          );
          // eslint-disable-next-line no-unused-vars
        } catch (error) {
          attempts++;
        }
      }

      if (!coords) {
        throw new Error(
          `Failed to place ${ship.name} after ${MAX_ATTEMPTS} attempts`,
        );
      }
    });

    return true;
  }

  receiveAttack(x, y) {
    if (!ROWS.includes(x) || y < 1 || y > 10) throw new Error('Out of bounds.');

    if (typeof this.grid.get(`${x}-${y}`) === 'string') {
      const shipName = this.grid.get(`${x}-${y}`);
      const ship = this.fleet.get(shipName);
      ship.hit();
      this.grid.set(`${x}-${y}`, 0);

      return ship.isSunk()
        ? this.#allShipsSunk()
          ? `${ship.name} got sunk. Game over. You lost`
          : `${ship.name} got sunk`
        : `${ship.name} got hit`;
    } else if (this.grid.get(`${x}-${y}`) === 1) {
      this.grid.set(`${x}-${y}`, 0);
      return 'Miss';
    } else {
      return;
    }
  }

  #allShipsSunk() {
    const hasShipsLeft = Array.from(this.grid.values()).some(
      (value) => typeof value === 'string',
    );

    return !hasShipsLeft;
  }

  get shipPositions() {
    return new Map(this.#shipPositions);
  }
}

export default Gameboard;
