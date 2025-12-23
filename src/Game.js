import Player from './components/Player';
import Render from './components/Render';

const PLAYER_TYPE = {
  HUMAN: 'human',
  BOT: 'bot',
};

// Game controller - interacts with DOM
class Game {
  constructor() {
    this.player1 = new Player(PLAYER_TYPE.HUMAN, 'Dee');
    this.player2 = new Player(PLAYER_TYPE.BOT);
    this.init();
  }

  init() {
    const container = document.querySelector('.container');
    const userPrompt = Render.firstScreen();
    container.appendChild(userPrompt);
  }
}

export default Game;
