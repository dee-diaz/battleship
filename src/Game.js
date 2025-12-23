import Player from './components/Player';
import Render from './components/Render';

const PLAYER_TYPE = {
  HUMAN: 'human',
  BOT: 'bot',
};

// Game controller - interacts with DOM
class Game {
  constructor() {
    this.player1 = null;
    this.player2 = new Player(PLAYER_TYPE.BOT);
    this.container = document.querySelector('.container');
    this.init();
    this.addListeners();
  }

  addListeners() {
    const form = document.querySelector('#user-name-form');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const userName = e.target.elements['user-name'].value;
      this.player1 = new Player(PLAYER_TYPE.HUMAN, userName);
      Render.removeFromDOM('.user-prompt');
      const gameboards = Render.gameboards(userName);
      this.container.appendChild(gameboards);
    });
  }

  init() {
    const userPrompt = Render.firstScreen();
    this.container.appendChild(userPrompt);
  }
}

export default Game;
