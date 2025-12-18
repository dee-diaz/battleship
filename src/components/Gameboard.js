class Gameboard {
  constructor() {
    this.grid = this.#buildGrid();
  }

  #buildGrid(size = 10) {
    const map = new Map();
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'G'];

    rows.forEach((row) => {
      for (let i = 1; i <= size; i++) {
        const key = [row, i];
        map.set(key, 1);
      }
    });

    return map;
  }
}

export default Gameboard;
