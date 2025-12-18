/* eslint-disable no-undef */
import Gameboard from '../components/Gameboard';

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
    it('carrier occupies 5 squares', () => {
      expect(fleet.get('carrier')).toBe(5);
    });
    it('battleship occupies 4 squares', () => {
      expect(fleet.get('battleship')).toBe(4);
    });
    it('cruiser occupies 3 squares', () => {
      expect(fleet.get('cruiser')).toBe(3);
    });
    it('submarine occupies 3 squares', () => {
      expect(fleet.get('submarine')).toBe(3);
    });
    it('destroyer occupies 2 squares', () => {
      expect(fleet.get('destroyer')).toBe(2);
    });
  });
});
