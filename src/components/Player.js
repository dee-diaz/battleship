import Gameboard from './Gameboard';

class Player {
  constructor(playerType) {
    this.playerType = playerType;
    this.gameboard = new Gameboard();
    this.gameboard.placeShips();
  }
}

export default Player;
