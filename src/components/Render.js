import { ROWS } from './Gameboard';

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
    gameboard2.className = 'gameboard';

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

    return gameCont;
  }
}

export default Render;
