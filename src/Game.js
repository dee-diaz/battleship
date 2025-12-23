import Player from './components/Player';

const PLAYER_TYPE = {
  HUMAN: 'human',
  BOT: 'bot',
};

// Game controller - interacts with DOM
class Game {
  constructor() {
    this.player1 = new Player(PLAYER_TYPE.HUMAN, 'Dee');
    this.player2 = new Player(PLAYER_TYPE.BOT);
  }
}

export default Game;
