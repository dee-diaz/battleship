import Gameboard from './Gameboard';
import { PLAYER_TYPE } from '../Game';

class Player {
  constructor(playerType, name) {
    this.playerType = playerType;
    this.name = name || 'Bot';
    this.gameboard = new Gameboard();
    if (this.playerType === PLAYER_TYPE.BOT) this.gameboard.placeShips();
  }

  resetGameboard() {
    this.gameboard = new Gameboard();
    this.gameboard.placeShips();
  }
}

export default Player;
