import Player from './components/Player';
import Render from './components/Render';
import { randomInt } from './components/utils';
import { ROWS } from './components/Gameboard';

const PLAYER_TYPE = {
  HUMAN: 'human',
  BOT: 'bot',
};

// Game controller - interacts with DOM
class Game {
  constructor() {
    this.gameUI = null;
    this.player1 = null;
    this.currentTurn = null;
    this.player2 = new Player(PLAYER_TYPE.BOT);
    this.container = document.querySelector('.container');
    this.init();
    this.addListeners();
  }

  addListeners() {
    const form = document.querySelector('#user-name-form');

    form.addEventListener('submit', this.#startGame);

    this.container.addEventListener('click', this.#attack);
  }

  #attack = async (e) => {
    const square = e.target.closest('.gameboard.enemy .square');
    if (!square) return;

    const attackResult = this.player2.gameboard.receiveAttack(
      square.dataset.row,
      square.dataset.col,
    );

    this.changeStatus(attackResult);

    if (attackResult.includes('sunk')) {
      const shipName = attackResult.split(' ')[0];
      const shipPositions = this.player2.gameboard.shipPositions;
      const sunkShipCoords = shipPositions.get(shipName);

      sunkShipCoords.forEach((coord) => {
        const row = coord.split('-')[0];
        const col = coord.split('-')[1];

        Render.attack(this.gameUI.boardEnemy, row, col, 'sunk');
      });
    }

    Render.attack(
      this.gameUI.boardEnemy,
      square.dataset.row,
      square.dataset.col,
      attackResult,
    );

    if (attackResult === 'Miss') {
      await this.endTurn();
    }
  };

  #botAttack = async () => {
    const hasAvailableCells = Array.from(
      this.player1.gameboard.grid.values(),
    ).some((value) => value !== 0);

    if (!hasAvailableCells) {
      return;
    }

    const randomRow = ROWS[randomInt(0, 9)];
    const randomCol = randomInt(1, 10);
    const cellValue = this.player1.gameboard.grid.get(
      `${randomRow}-${randomCol}`,
    );

    if (cellValue === 0) {
      await this.#botAttack();
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const attackResult = this.player1.gameboard.receiveAttack(
      randomRow,
      randomCol,
    );

    Render.attack(this.gameUI.boardUser, randomRow, randomCol, attackResult);

    this.changeStatus(attackResult);

    if (attackResult !== 'Miss') {
      await this.#botAttack();
    } else {
      await this.endTurn();
    }
  };

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
      Render.gameOver(this.gameUI.statusPanel, 'Game over');
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
    this.gameUI = Render.gameboards(userName);
    this.container.appendChild(this.gameUI.root);
    Render.ships(this.gameUI.boardUser, this.player1.gameboard.shipPositions);
  };

  init() {
    const userPrompt = Render.firstScreen();
    this.container.appendChild(userPrompt);
  }
}

export default Game;
