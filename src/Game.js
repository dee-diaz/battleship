import Player from './components/Player';
import Render from './components/Render';

const PLAYER_TYPE = {
  HUMAN: 'human',
  BOT: 'bot',
};

// Game controller - interacts with DOM
class Game {
  constructor() {
    this.gameUI = null;
    this.player1 = null;
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

  #attack = (e) => {
    const square = e.target.closest('.gameboard.enemy .square');
    if (!square) return;

    const attackResult = this.player2.gameboard.receiveAttack(
      square.dataset.row,
      square.dataset.col,
    );

    console.log(attackResult);

    Render.attack(square.dataset.row, square.dataset.col, attackResult);
  };

  #startGame = (e) => {
    e.preventDefault();
    const userName = e.target.elements['user-name'].value;
    this.player1 = new Player(PLAYER_TYPE.HUMAN, userName);
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
