import Gameboard from './Gameboard';

class Player {
  constructor(playerType, name) {
    this.playerType = playerType;
    this.name = name || 'Bot';
    this.gameboard = new Gameboard();
    this.gameboard.placeShips();
  }
}

export default Player;
