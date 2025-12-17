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

  // ship.hit()
  describe('hit', () => {
    it('increase the number of hits by 1', () => {
      expect(ship.hit()).toBe(ship.numOfHits);
    });
    it('does nothing if the ship is sunk', () => {
      ship.isSunk = true;
      expect(ship.hit()).toBeNull();
    });
    it("number of hits can't exceed the ship's length", () => {
      ship.numOfHits = 5;
      expect(ship.hit()).toBeNull();
    });
  });
});
