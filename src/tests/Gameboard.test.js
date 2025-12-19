/* eslint-disable no-undef */
import Gameboard from '../components/Gameboard';
import { SHIPS, ROWS, COLS, AXIS } from '../components/Gameboard';

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

  describe('_placeShipAt (core logic)', () => {
    let fleet;
    beforeEach(() => {
      fleet = gameboard.createFleet();
    });

    describe('valid placements', () => {
      it('places ship of length 2 vertically', () => {
        const destroyer = fleet.get(SHIPS.DESTROYER);
        expect(
          gameboard._placeShipAt(destroyer, ROWS[1], COLS[3], AXIS.Y),
        ).toEqual(['B-4', 'C-4']);
      });

      it('places ship of length 3 vertically', () => {
        const submarine = fleet.get(SHIPS.SUBMARINE);
        expect(
          gameboard._placeShipAt(submarine, ROWS[1], COLS[3], AXIS.Y),
        ).toEqual(['B-4', 'C-4', 'D-4']);
      });

      it('places ship of length 4 vertically', () => {
        const battleship = fleet.get(SHIPS.BATTLESHIP);
        expect(
          gameboard._placeShipAt(battleship, ROWS[1], COLS[3], AXIS.Y),
        ).toEqual(['B-4', 'C-4', 'D-4', 'E-4']);
      });
      it('places ship of length 5 vertically', () => {
        const carrier = fleet.get(SHIPS.CARRIER);
        expect(
          gameboard._placeShipAt(carrier, ROWS[1], COLS[3], AXIS.Y),
        ).toEqual(['B-4', 'C-4', 'D-4', 'E-4', 'F-4']);
      });
    });
  });
});
