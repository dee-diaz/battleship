/* eslint-disable no-undef */
import Gameboard from './Gameboard';

class Player {
  constructor() {
    this.gameboard = new Gameboard();
    this.gameboard.placeShips();
  }
}

export default Player;
