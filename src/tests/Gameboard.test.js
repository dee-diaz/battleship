/* eslint-disable no-undef */
import Gameboard from '../components/Gameboard';

describe('Gameboard', () => {
  let gameboard;

  beforeEach(() => {
    gameboard = new Gameboard();
  });

  describe('constructor', () => {
    it('should create gameboard with 100 cells', () => {
      expect(gameboard.grid.size).toBe(100);
    });
    it("all cells's values should be equal to 1", () => {
      const values = Array.from(gameboard.grid.values());
      expect(values.every((val) => val === 1)).toBe(true);
    });
  });
});
