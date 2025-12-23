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
    input.id = 'input-name';
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
}

export default Render;
