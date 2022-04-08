import { Socket, io } from 'socket.io-client';

interface IMessage {
  username: string;
  message: string;
  textColor?: string;
  nameColor?: string;
}

interface IColor {
  [key: string]: string | undefined;
}

const usernameInput = document.getElementById('username') as HTMLInputElement;
const colorPickerInputs = document.getElementsByClassName('colorPicker') as HTMLCollectionOf<HTMLInputElement>;
const chatForm = document.getElementById('chatForm') as HTMLElement;
const messagesContainer = document.getElementById('messagesContainer') as HTMLElement;

const colors: IColor = {
  textColor: undefined,
  nameColor: undefined,
}

let username = usernameInput.value;
let socketClient: Socket | undefined;

let messages: IMessage[] = [];

function handleSetMessages(messages: IMessage[]) {
  if (messages.length === 0) {
    return;
  }

  messagesContainer.innerHTML = '';

  const messagesElements = messages.map(message => {
    const divElement = document.createElement('div');
    const spanElement = document.createElement('span');
    const paragraphElement = document.createElement('p');

    const spanElementText = document.createTextNode(message.username);
    const paragraphElementText = document.createTextNode(message.message);

    spanElement.appendChild(spanElementText);
    paragraphElement.appendChild(paragraphElementText);

    if (message.textColor) {
      paragraphElement.setAttribute('style', `color: ${message.textColor}`);
    }
    
    if (message.nameColor) {
      spanElement.setAttribute('style', `color: ${message.nameColor}`);
    }

    divElement.setAttribute('class', 'message');

    divElement.appendChild(spanElement);
    divElement.appendChild(paragraphElement);

    return divElement;
  });

  messagesElements.forEach(item => messagesContainer.appendChild(item));

  messagesContainer.scrollTo({ behavior: 'smooth', top: messagesContainer.scrollHeight });
}

function initializeStoragedData() {
  const textColorStoraged = localStorage.getItem('textColor');
  const nameColorStoraged = localStorage.getItem('nameColor');
  const usernameStoraged = localStorage.getItem('username');

  if (textColorStoraged) {
    const textColorInput = document.getElementById('textColor') as HTMLInputElement;

    colors.textColor = textColorStoraged;
    textColorInput.value = textColorStoraged;
  }

  if (nameColorStoraged) {
    const nameColorInput = document.getElementById('nameColor') as HTMLInputElement;

    colors.nameColor = nameColorStoraged;
    nameColorInput.value = nameColorStoraged;
  }

  if (usernameStoraged) {
    const chatSendButton = document.getElementById('sendMessageButton') as HTMLButtonElement;

    usernameInput.value = usernameStoraged;
    username = usernameStoraged;

    chatSendButton.removeAttribute('disabled');
  }
}

function initializeSocketClient() {
  if (!socketClient) {
    socketClient = io('http://localhost:3333');

    socketClient.on('getMessages', data => {
      messages = data;
      handleSetMessages(messages);
    });

  }
}

function handleUsernameInputBlur(event: FocusEvent) {
  const { target } = event;

  if (!target) {
    return;
  }

  const { value } = target as HTMLInputElement;
  const sendMessageButton = document.getElementById('sendMessageButton') as HTMLElement;

  if (value !== '') {
    sendMessageButton.removeAttribute('disabled');

    username = value;

    localStorage.setItem('username', value);
  } else {
    sendMessageButton.setAttribute('disabled', '');

    username = '';
  }
}

function handleChatFormSubmit(event: SubmitEvent) {
  event.preventDefault();

  const target = event.target as HTMLFormElement;

  const formData = new FormData(target);
  const message = formData.get('message') as string;

  if (!socketClient) {
    return;
  }

  socketClient.emit('sendMessage', { message: message.trim(), username, ...colors });

  target.reset();
}

function handleColorPickerBlur(event: FocusEvent) {
  const target = event.target as HTMLInputElement;

  const { id, value } = target;

  colors[id] = value;

  localStorage.setItem(id, value);
}

usernameInput.addEventListener('blur', handleUsernameInputBlur);
chatForm.addEventListener('submit', handleChatFormSubmit);

Array.from(colorPickerInputs).forEach(element => {
  element.addEventListener('blur', handleColorPickerBlur);
});

initializeSocketClient();
initializeStoragedData();
