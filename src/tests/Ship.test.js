/* eslint-disable no-undef */
import Ship from '../components/Ship';

describe('Ship', () => {
  let ship;

  beforeEach(() => {
    ship = new Ship(4);
  });

  describe('constructor', () => {
    it('should create ship with correct properties', () => {
      expect(ship.length).toBe(4);
      expect(ship.numOfHits).toBe(0);
      expect(ship.isSunk).toBe(false);
    });
  });
});
