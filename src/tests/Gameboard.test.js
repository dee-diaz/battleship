/* eslint-disable no-undef */
import Gameboard from '../components/Gameboard';
import { SHIPS, ROWS, AXIS } from '../components/Gameboard';

describe('Gameboard', () => {
  let gameboard;

  beforeEach(() => {
    gameboard = new Gameboard();
  });

  describe('constructor', () => {
    it('should create gameboard with 100 squares', () => {
      expect(gameboard.grid.size).toBe(100);
    });
    it("all squares's values should be equal to 1", () => {
      const values = Array.from(gameboard.grid.values());
      expect(values.every((val) => val === 1)).toBe(true);
    });
  });

  describe('createFleet', () => {
    let fleet;
    beforeEach(() => {
      fleet = gameboard.createFleet();
    });

    it('creates a fleet of 5 ships', () => {
      expect(fleet.size).toBe(5);
    });
    it('carrier size is 5 squares', () => {
      const carrier = fleet.get(SHIPS.CARRIER);
      expect(carrier.length).toBe(5);
    });
    it('battleship size is 4 squares', () => {
      const battleship = fleet.get(SHIPS.BATTLESHIP);
      expect(battleship.length).toBe(4);
    });
    it('cruiser size is 3 squares', () => {
      const cruiser = fleet.get(SHIPS.CRUISER);
      expect(cruiser.length).toBe(3);
    });
    it('submarine size is 3 squares', () => {
      const submarine = fleet.get(SHIPS.SUBMARINE);
      expect(submarine.length).toBe(3);
    });
    it('destroyer size is 2 squares', () => {
      const destroyer = fleet.get(SHIPS.DESTROYER);
      expect(destroyer.length).toBe(2);
    });
  });

  describe('placeShipAt (core logic)', () => {
    let fleet;
    beforeEach(() => {
      fleet = gameboard.createFleet();
    });

    describe('valid vertical placements', () => {
      it('places ship of length 2 vertically', () => {
        const destroyer = fleet.get(SHIPS.DESTROYER);
        expect(gameboard.placeShipAt(destroyer, ROWS[1], 4, AXIS.Y)).toEqual([
          'B-4',
          'C-4',
        ]);
      });

      it('places ship of length 3 vertically', () => {
        const submarine = fleet.get(SHIPS.SUBMARINE);
        expect(gameboard.placeShipAt(submarine, ROWS[1], 4, AXIS.Y)).toEqual([
          'B-4',
          'C-4',
          'D-4',
        ]);
      });

      it('places ship of length 4 vertically', () => {
        const battleship = fleet.get(SHIPS.BATTLESHIP);
        expect(gameboard.placeShipAt(battleship, ROWS[1], 4, AXIS.Y)).toEqual([
          'B-4',
          'C-4',
          'D-4',
          'E-4',
        ]);
      });
      it('places ship of length 5 vertically', () => {
        const carrier = fleet.get(SHIPS.CARRIER);
        expect(gameboard.placeShipAt(carrier, ROWS[1], 4, AXIS.Y)).toEqual([
          'B-4',
          'C-4',
          'D-4',
          'E-4',
          'F-4',
        ]);
      });

      it('places ship at edge of board (bottom edge, vertical)', () => {
        const destroyer = fleet.get(SHIPS.DESTROYER);
        expect(gameboard.placeShipAt(destroyer, ROWS[8], 4, AXIS.Y)).toEqual([
          'I-4',
          'J-4',
        ]);
      });
    });

    describe('valid horizontal placements', () => {
      it('places ship of length 2 horizontally', () => {
        const destroyer = fleet.get(SHIPS.DESTROYER);
        expect(gameboard.placeShipAt(destroyer, ROWS[1], 4, AXIS.X)).toEqual([
          'B-4',
          'B-5',
        ]);
      });

      it('places ship of length 3 horizontally', () => {
        const submarine = fleet.get(SHIPS.SUBMARINE);
        expect(gameboard.placeShipAt(submarine, ROWS[1], 4, AXIS.X)).toEqual([
          'B-4',
          'B-5',
          'B-6',
        ]);
      });

      it('places ship of length 4 horizontally', () => {
        const battleship = fleet.get(SHIPS.BATTLESHIP);
        expect(gameboard.placeShipAt(battleship, ROWS[1], 4, AXIS.X)).toEqual([
          'B-4',
          'B-5',
          'B-6',
          'B-7',
        ]);
      });

      it('places ship of length 5 horizontally', () => {
        const carrier = fleet.get(SHIPS.CARRIER);
        expect(gameboard.placeShipAt(carrier, ROWS[1], 4, AXIS.X)).toEqual([
          'B-4',
          'B-5',
          'B-6',
          'B-7',
          'B-8',
        ]);
      });

      it('places ship at edge of board (right edge, horizontal)', () => {
        const destroyer = fleet.get(SHIPS.DESTROYER);
        expect(gameboard.placeShipAt(destroyer, ROWS[1], 9, AXIS.X)).toEqual([
          'B-9',
          'B-10',
        ]);
      });
    });

    describe('invalid placements - out of bounds', () => {
      let submarine;
      beforeEach(() => {
        submarine = fleet.get(SHIPS.SUBMARINE);
      });

      it('throws when horizontal ship goes off right edge', () => {
        expect(() =>
          gameboard.placeShipAt(submarine, ROWS[1], 9, AXIS.X),
        ).toThrow('Out of bounds.');
      });
      it('throws when vertical ship goes off bottom edge', () => {
        expect(() =>
          gameboard.placeShipAt(submarine, ROWS[8], 1, AXIS.Y),
        ).toThrow('Out of bounds.');
      });
      it('throws when coordinates are negative', () => {
        expect(() =>
          gameboard.placeShipAt(submarine, ROWS[1], -2, AXIS.Y),
        ).toThrow('Enter correct coordinates!');
      });
      it('throws when coordinates exceed board size', () => {
        expect(() =>
          gameboard.placeShipAt(submarine, ROWS[1], -2, AXIS.Y),
        ).toThrow('Enter correct coordinates!');
      });
      it('throws when the orientation is incorrect', () => {
        expect(() =>
          gameboard.placeShipAt(submarine, ROWS[1], 1, 'diagonal'),
        ).toThrow('Invalid orientation');
      });
    });

    describe('invalid placements - overlap', () => {
      let submarine;
      let cruiser;
      beforeEach(() => {
        submarine = fleet.get(SHIPS.SUBMARINE);
        cruiser = fleet.get(SHIPS.CRUISER);
      });

      it('throws when ships overlap completely', () => {
        gameboard.placeShipAt(submarine, ROWS[1], 4, AXIS.X);
        expect(() =>
          gameboard.placeShipAt(cruiser, ROWS[1], 4, AXIS.X),
        ).toThrow("Can't place here.");
      });

      it('throws when ships overlap partially', () => {
        gameboard.placeShipAt(submarine, ROWS[1], 4, AXIS.X);
        expect(() =>
          gameboard.placeShipAt(cruiser, ROWS[1], 6, AXIS.X),
        ).toThrow("Can't place here.");
      });

      it('throws when ships are adjacent (touching but not overlapping)', () => {
        gameboard.placeShipAt(submarine, ROWS[4], 5, AXIS.Y);
        expect(() =>
          gameboard.placeShipAt(cruiser, ROWS[5], 5, AXIS.Y),
        ).toThrow("Can't place here.");
      });
    });

    it('marks all occupied cells on the grid', () => {
      const submarine = fleet.get(SHIPS.SUBMARINE);
      gameboard.placeShipAt(submarine, ROWS[1], 1, AXIS.X);
      expect(gameboard.grid.get(`${ROWS[1]}-1`)).toBe(submarine.name);
      expect(gameboard.grid.get(`${ROWS[1]}-2`)).toBe(submarine.name);
      expect(gameboard.grid.get(`${ROWS[1]}-3`)).toBe(submarine.name);
    });
  });

  describe('placeShips (random placement)', () => {
    it('successfully places ships on empty board', () => {
      expect(gameboard.placeShips()).toBeTruthy();
    });

    it('places all 5 ships on the board', () => {
      gameboard.placeShips();
      const occupiedCells = Array.from(gameboard.grid.values()).filter(
        (cell) => typeof cell === 'string',
      );
      expect(occupiedCells.length).toBe(17);
    });
  });

  describe('receiveAttack', () => {
    let submarine;
    let destroyer;
    beforeEach(() => {
      submarine = gameboard.fleet.get(SHIPS.SUBMARINE);
      destroyer = gameboard.fleet.get(SHIPS.DESTROYER);
      gameboard.placeShipAt(submarine, ROWS[1], 1, AXIS.Y);
      gameboard.placeShipAt(destroyer, ROWS[8], 1, AXIS.X);
    });

    it('throw if coordinates are out of bounds', () => {
      expect(() => gameboard.receiveAttack(ROWS[1], 11)).toThrow(
        'Out of bounds.',
      );
      expect(() => gameboard.receiveAttack('X', 2)).toThrow('Out of bounds.');
    });

    it('ship gets hit', () => {
      expect(gameboard.receiveAttack(ROWS[1], 1)).toMatch('submarine got hit');
      expect(gameboard.grid.get(`${ROWS[1]}-1`)).toBe(0);
    });

    it('ship gets sunk', () => {
      expect(gameboard.receiveAttack(ROWS[1], 1)).toMatch('submarine got hit');
      expect(gameboard.receiveAttack(ROWS[2], 1)).toMatch('submarine got hit');
      expect(gameboard.receiveAttack(ROWS[3], 1)).toMatch('submarine got sunk');
      expect(gameboard.grid.get(`${ROWS[1]}-1`)).toBe(0);
      expect(gameboard.grid.get(`${ROWS[2]}-1`)).toBe(0);
      expect(gameboard.grid.get(`${ROWS[3]}-1`)).toBe(0);
    });

    it('hits an empty square', () => {
      expect(gameboard.grid.get(`${ROWS[5]}-8`)).toBe(1);
      expect(gameboard.receiveAttack(ROWS[5], 8)).toMatch('Miss');
      expect(gameboard.grid.get(`${ROWS[5]}-8`)).toBe(0);
    });

    it("can't hit an already hit square", () => {
      gameboard.receiveAttack(ROWS[5], 8);
      expect(gameboard.grid.get(`${ROWS[5]}-8`)).toBe(0);
      expect(gameboard.receiveAttack(ROWS[5], 8)).toMatch('No effect');
    });

    it('report if all the ships have been sunk', () => {
      gameboard.receiveAttack(ROWS[1], 1);
      gameboard.receiveAttack(ROWS[2], 1);
      gameboard.receiveAttack(ROWS[3], 1);

      gameboard.receiveAttack(ROWS[8], 1);
      expect(gameboard.receiveAttack(ROWS[8], 2)).toMatch(
        'Game over. All ships have been sunk',
      );
    });
  });
});
