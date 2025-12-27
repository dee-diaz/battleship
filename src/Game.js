import Player from './components/Player';
import Render from './components/Render';
import { randomInt } from './components/utils';
import { AXIS, ROWS, SHIPS } from './components/Gameboard';

export const PLAYER_TYPE = {
  HUMAN: 'human',
  BOT: 'bot',
};

const STATUS = {
  MISS: 'shoots and misses',
  HIT: 'shoots and hits',
  SINK: "sinks the enemy's ship",
  WIN: 'won. Game over',
};

// Game controller - interacts with DOM
class Game {
  constructor() {
    this.gameUI = null;
    this.player1 = null;
    this.currentTurn = null;
    this.lastHitCell = null;
    this.hitCells = [];
    this.targetQueue = [];
    this.attackDirection = null;
    this._shipToPlaceIndex = 0;
    this._shipsPlaced = false;
    this._placementOrientation = AXIS.X;
    this.player2 = new Player(PLAYER_TYPE.BOT);
    this.container = document.querySelector('.container');
    this.init();
    this.addListeners();
  }

  addListeners() {
    const form = document.querySelector('#user-name-form');

    form.addEventListener('submit', this.#startGame);

    this.container.addEventListener('click', (e) => {
      if (e.target.id === 'btn-replay') {
        this.restartGame();
      } else {
        this.#attack(e);
      }
    });
  }

  restartGame() {
    this.player1.resetGameboard();
    this.player2.resetGameboard();
    this.container.innerHTML = '';
    this.container.appendChild(Render.pageTitle());
    this.gameUI = Render.gameboards(this.player1.name);
    this.container.appendChild(this.gameUI.root);
    Render.ships(this.gameUI.boardUser, this.player1.gameboard.shipPositions);
    this.currentTurn = this.player1.name;
    this.lastHitCell = null;
    this.hitCells = [];
    this.targetQueue = [];
    this.attackDirection = null;
    this._shipToPlaceIndex = 0;
    this._shipsPlaced = false;
  }

  #attack = async (e) => {
    const square = e.target.closest('.gameboard.enemy .square');
    if (!square) return;

    const attackResult = this.player2.gameboard.receiveAttack(
      square.dataset.row,
      square.dataset.col,
    );

    if (attackResult.includes('hit'))
      this.changeStatus(`${this.player1.name} ${STATUS.HIT}`);

    if (attackResult.includes('sunk')) {
      this.changeStatus(`${this.player1.name} ${STATUS.SINK}`);
      this.handleSunkRender(attackResult, this.player2);
    }

    if (attackResult.includes('Game over')) {
      this.changeStatus(`${this.player1.name} ${STATUS.WIN}`);

      Render.attack(
        this.gameUI.boardEnemy,
        square.dataset.row,
        square.dataset.col,
        attackResult,
      );

      const btn = Render.restartBtn();
      btn.id = 'btn-replay';
      this.container.appendChild(btn);

      return;
    }

    Render.attack(
      this.gameUI.boardEnemy,
      square.dataset.row,
      square.dataset.col,
      attackResult,
    );

    if (attackResult === 'Miss') {
      this.changeStatus(`${this.player1.name} ${STATUS.MISS}`);
      await this.endTurn();
    }
  };

  handleSunkRender(attackRes, player) {
    const shipName = attackRes.split(' ')[0];
    const shipPositions = player.gameboard.shipPositions;
    const sunkShipCoords = shipPositions.get(shipName);

    sunkShipCoords.forEach((coord) => {
      const row = coord.split('-')[0];
      const col = coord.split('-')[1];

      if (player.name === this.player1.name) {
        Render.attack(this.gameUI.boardUser, row, col, 'sunk');
      } else {
        Render.attack(this.gameUI.boardEnemy, row, col, 'sunk');
      }
    });
  }

  #botAttack = async () => {
    const hasAvailableCells = Array.from(
      this.player1.gameboard.grid.values(),
    ).some((value) => value !== 0);

    if (!hasAvailableCells) {
      return;
    }

    let targetRow, targetCol;

    if (this.targetQueue.length > 0) {
      [targetRow, targetCol] = this.targetQueue.shift();

      const cellValue = this.player1.gameboard.grid.get(
        `${targetRow}-${targetCol}`,
      );

      if (!cellValue || cellValue === 0) {
        await this.#botAttack();
        return;
      }
    } else {
      do {
        targetRow = ROWS[randomInt(0, 9)];
        targetCol = randomInt(1, 10);
      } while (
        this.player1.gameboard.grid.get(`${targetRow}-${targetCol}`) === 0
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const attackResult = this.player1.gameboard.receiveAttack(
      targetRow,
      targetCol,
    );

    if (attackResult === 'Miss')
      this.changeStatus(`${this.player2.name} ${STATUS.MISS}`);

    if (attackResult.includes('sunk')) {
      this.changeStatus(`${this.player2.name} ${STATUS.SINK}`);
      this.handleSunkRender(attackResult, this.player1);

      if (attackResult.includes('Game over')) {
        this.changeStatus(`${this.player2.name} ${STATUS.WIN}`);
        const btn = Render.restartBtn();
        btn.id = 'btn-replay';
        this.container.appendChild(btn);
        return;
      }
    }

    Render.attack(this.gameUI.boardUser, targetRow, targetCol, attackResult);

    if (attackResult.includes('hit')) {
      this.changeStatus(`${this.player2.name} ${STATUS.HIT}`);
      this.hitCells.push([targetRow, targetCol]);

      if (this.hitCells.length === 1) {
        this.#addNeighborsToQueue(targetRow, targetCol);
      } else {
        this.#addDirectionalTargets(targetRow, targetCol);
      }

      await this.#botAttack();
    } else if (attackResult.includes('sunk')) {
      this.hitCells = [];
      this.targetQueue = [];
      await this.#botAttack();
    } else {
      await this.endTurn();
    }
  };

  #addNeighborsToQueue(row, col) {
    const rowIndex = ROWS.indexOf(row);

    const neighbors = [
      [ROWS[rowIndex - 1], col],
      [ROWS[rowIndex + 1], col],
      [row, col - 1],
      [row, col + 1],
    ];

    neighbors.forEach(([r, c]) => {
      if (r && c >= 1 && c <= 10) {
        const cellValue = this.player1.gameboard.grid.get(`${r}-${c}`);
        if (cellValue && cellValue !== 0) {
          this.targetQueue.push([r, c]);
        }
      }
    });
  }

  #addDirectionalTargets(row, col) {
    const [prevRow, prevCol] = this.hitCells[this.hitCells.length - 2];

    if (prevRow === row) {
      const direction = col > prevCol ? 1 : -1;
      this.targetQueue = [[row, col + direction]];
    } else {
      const rowIndex = ROWS.indexOf(row);
      const prevRowIndex = ROWS.indexOf(prevRow);
      const direction = rowIndex > prevRowIndex ? 1 : -1;
      this.targetQueue = [[ROWS[rowIndex + direction], col]];
    }
  }

  async endTurn() {
    this.currentTurn === this.player1.name
      ? (this.currentTurn = this.player2.name)
      : (this.currentTurn = this.player1.name);

    await this.nextMove(this.currentTurn);
  }

  async nextMove(player) {
    if (player === this.player2.name) {
      this.gameUI.boardEnemy.classList.add('disabled');
      await this.#botAttack();
    }

    if (player === this.player1.name) {
      this.gameUI.boardEnemy.classList.remove('disabled');
    }
  }

  changeStatus(status) {
    if (status.includes('Game over')) {
      Render.gameOver(this.gameUI.statusPanel, status);
    } else {
      Render.status(this.gameUI.statusPanel, status);
    }
  }

  #startGame = (e) => {
    e.preventDefault();
    const userName = e.target.elements['user-name'].value;
    this.player1 = new Player(PLAYER_TYPE.HUMAN, userName);
    this.currentTurn = this.player1.name;
    Render.removeFromDOM('.user-prompt');
    this.gameUI = Render.gameboards(this.player1.name);
    Render.toggleGameboardInteractivity(this.gameUI.boardEnemy);
    this.container.appendChild(this.gameUI.root);
    const placementBtns = Render.axisBtns();
    this.gameUI.statusPanel.after(placementBtns);

    this.gameUI.boardUser.addEventListener(
      'mouseover',
      this.#handlePlacementHover,
    );

    this.gameUI.boardUser.addEventListener('click', this.#handlePlacementClick);
  };

  #handlePlacementHover = (e) => {
    if (!e.target.closest('.square')) return;
    const currentSquare = e.target.closest('.square');
    const row = currentSquare.dataset.row;
    const col = currentSquare.dataset.col;
    const shipsArr = Object.values(SHIPS);

    const markedCells = this.gameUI.boardUser.querySelectorAll(
      '.ship-preview, .out-of-bounds',
    );
    markedCells.forEach((cell) => {
      if (cell !== currentSquare) {
        cell.classList.remove('ship-preview', 'out-of-bounds');
      }
    });

    const fleet = this.player1.gameboard.fleet;

    try {
      const coords = this.player1.gameboard.placeShipAt(
        fleet.get(shipsArr[this._shipToPlaceIndex]),
        row,
        col,
        this._placementOrientation,
      );

      Render.targetShipLocation(this.gameUI.boardUser, coords);
    } catch (error) {
      Render.targetShipLocation(this.gameUI.boardUser, `${row}-${col}`);
    }
  };

  #handlePlacementClick = (e) => {
    if (!e.target.closest('.square')) return;
    const currentSquare = e.target.closest('.square');
    const row = currentSquare.dataset.row;
    const col = currentSquare.dataset.col;
    const shipsArr = Object.values(SHIPS);

    const ship = this.player1.gameboard.fleet.get(
      shipsArr[this._shipToPlaceIndex],
    );

    try {
      this.player1.gameboard.placeShipAt(
        ship,
        row,
        col,
        this._placementOrientation,
        'placement',
      );

      Render.ships(this.gameUI.boardUser, this.player1.gameboard.shipPositions);

      if (this._shipToPlaceIndex < 5) this._shipToPlaceIndex++;
      if (this._shipToPlaceIndex === 5) {
        this._shipsPlaced = true;
        this._shipToPlaceIndex = 0;
      }

      if (this._shipsPlaced) {
        Render.toggleGameboardInteractivity(this.gameUI.boardUser);
        Render.removeFromDOM('.placement-buttons');
      }
    } catch (error) {
      console.error('Cannot place ship here:', error.message);
    }
  };

  init() {
    const userPrompt = Render.firstScreen();
    this.container.appendChild(userPrompt);
  }
}

export default Game;
