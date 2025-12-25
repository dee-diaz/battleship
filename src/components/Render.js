import { ROWS } from './Gameboard';
import iconSplash from '../icons/icon-splash.svg';
import iconHit from '../icons/icon-hit.svg';

class Render {
  static firstScreen() {
    const userPrompt = document.createElement('div');
    userPrompt.className = 'user-prompt';

    const para = document.createElement('p');
    para.textContent = 'What’s your name, cap?';

    const form = document.createElement('form');
    form.id = 'user-name-form';

    const formControl = document.createElement('div');
    formControl.className = 'form-control';

    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'user-name';
    input.placeholder = 'Enter your name';
    input.minLength = 2;
    input.required = true;

    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.textContent = 'Start game';

    formControl.appendChild(input);

    form.appendChild(formControl);
    form.appendChild(btn);

    userPrompt.appendChild(para);
    userPrompt.appendChild(form);

    return userPrompt;
  }

  static gameScreen() {}

  static removeFromDOM(selector) {
    document.querySelector(selector)?.remove();
  }

  static gameboards(userName) {
    const gameCont = document.createElement('div');
    gameCont.className = 'game';

    const statusPanel = document.createElement('div');
    statusPanel.className = 'status-panel';
    statusPanel.textContent = 'Your turn, captain!';

    const gameboardsCont = document.createElement('div');
    gameboardsCont.className = 'gameboards-container';

    const player1 = document.createElement('div');
    player1.className = 'player';

    const player1Id = document.createElement('div');
    player1Id.className = 'player-id user';
    player1Id.textContent = `${userName}'s fleet`;

    const gameboard1 = document.createElement('div');
    gameboard1.className = 'gameboard';

    player1.appendChild(player1Id);

    const player2 = document.createElement('div');
    player2.className = 'player';
    const player2Id = document.createElement('div');
    player2Id.className = 'player-id enemy';
    player2Id.textContent = `Enemy waters`;

    const gameboard2 = document.createElement('div');
    gameboard2.className = 'gameboard enemy';

    player2.appendChild(player2Id);

    const gameboards = [gameboard1, gameboard2];

    gameboards.forEach((board) => {
      ROWS.forEach((row) => {
        for (let i = 1; i <= 10; i++) {
          const square = document.createElement('div');
          square.className = 'square';
          square.dataset.row = row;
          square.dataset.col = i;
          board.appendChild(square);
        }
      });
    });

    player1.appendChild(gameboard1);
    player2.appendChild(gameboard2);

    gameboardsCont.appendChild(player1);
    gameboardsCont.appendChild(player2);

    gameCont.appendChild(statusPanel);
    gameCont.appendChild(gameboardsCont);

    return {
      root: gameCont,
      statusPanel,
      boardUser: gameboard1,
      boardEnemy: gameboard2,
    };
  }

  static ships(gameboardEl, coords) {
    // eslint-disable-next-line no-unused-vars
    for (const [key, value] of coords.entries()) {
      value.forEach((coord) => {
        const row = coord.split('-')[0];
        const col = coord.split('-')[1];

        const squareEl = gameboardEl.querySelector(
          `[data-row="${row}"][data-col="${col}"]`,
        );
        squareEl.classList.add('ship');
      });
    }
  }

  static attack(gameboardEl, row, col, message) {
    const squareEl = gameboardEl.querySelector(
      `[data-row="${row}"][data-col="${col}"]`,
    );
    const icon = document.createElement('img');
    let shipSquares = [];

    if (message === 'Miss') {
      icon.src = iconSplash;
    } else if (message.includes('hit')) {
      icon.src = iconHit;
      squareEl.classList.add('hit');
      shipSquares.push([row, col]);
    } else if (message.includes('sunk')) {
      if (!squareEl.classList.contains('hit')) squareEl.classList.add('hit');
      icon.src = iconHit;
      squareEl.classList.add('sunk');
    }

    if (!squareEl.querySelector('img')) squareEl.appendChild(icon);
    squareEl.classList.add('disabled');
  }

  static gameOver(statusPanelEl, message) {
    const gameboard = document.querySelector('.gameboard.enemy');
    gameboard.classList.add('disabled');

    this.status(statusPanelEl, message);
  }

  static status(statusPanelEl, message) {
    statusPanelEl.innerText = message;
  }

  static restartBtn() {
    const button = document.createElement('button');
    button.textContent = 'Play Again';
    return button;
  }
}

export default Render;
