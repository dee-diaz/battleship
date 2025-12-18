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
      expect(ship._numOfHits).toBe(0);
      expect(ship._isSunk).toBe(false);
    });
  });

  // ship.hit()
  describe('hit', () => {
    it('increase the number of hits by 1', () => {
      expect(ship.hit()).toBe(ship._numOfHits);
    });
    it('does nothing if the ship is sunk', () => {
      ship._isSunk = true;
      expect(ship.hit()).toBeNull();
    });
    it("number of hits can't exceed the ship's length", () => {
      ship._numOfHits = 5;
      expect(ship.hit()).toBeNull();
    });
  });

  // ship.isSunk()
  describe('isSunk', () => {
    it("ship's length is more than the number of hits", () => {
      expect(ship.isSunk()).toBeFalsy();
    });
    it("ship's length is less or equal than the number of hits", () => {
      ship._numOfHits = 4;
      expect(ship.isSunk()).toBeTruthy();
    });
  });
});
