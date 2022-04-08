"use strict";

var _socket = require("socket.io-client");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var usernameInput = document.getElementById('username');
var colorPickerInputs = document.getElementsByClassName('colorPicker');
var chatForm = document.getElementById('chatForm');
var messagesContainer = document.getElementById('messagesContainer');
var colors = {
  textColor: undefined,
  nameColor: undefined
};
var username = usernameInput.value;
var socketClient;
var messages = [];

function handleSetMessages(messages) {
  if (messages.length === 0) {
    return;
  }

  messagesContainer.innerHTML = '';
  var messagesElements = messages.map(function (message) {
    var divElement = document.createElement('div');
    var spanElement = document.createElement('span');
    var paragraphElement = document.createElement('p');
    var spanElementText = document.createTextNode(message.username);
    var paragraphElementText = document.createTextNode(message.message);
    spanElement.appendChild(spanElementText);
    paragraphElement.appendChild(paragraphElementText);

    if (message.textColor) {
      paragraphElement.setAttribute('style', "color: ".concat(message.textColor));
    }

    if (message.nameColor) {
      spanElement.setAttribute('style', "color: ".concat(message.nameColor));
    }

    divElement.setAttribute('class', 'message');
    divElement.appendChild(spanElement);
    divElement.appendChild(paragraphElement);
    return divElement;
  });
  messagesElements.forEach(function (item) {
    return messagesContainer.appendChild(item);
  });
  messagesContainer.scrollTo({
    behavior: 'smooth',
    top: messagesContainer.scrollHeight
  });
}

function initializeStoragedData() {
  var textColorStoraged = localStorage.getItem('textColor');
  var nameColorStoraged = localStorage.getItem('nameColor');
  var usernameStoraged = localStorage.getItem('username');

  if (textColorStoraged) {
    var textColorInput = document.getElementById('textColor');
    colors.textColor = textColorStoraged;
    textColorInput.value = textColorStoraged;
  }

  if (nameColorStoraged) {
    var nameColorInput = document.getElementById('nameColor');
    colors.nameColor = nameColorStoraged;
    nameColorInput.value = nameColorStoraged;
  }

  if (usernameStoraged) {
    var chatSendButton = document.getElementById('sendMessageButton');
    usernameInput.value = usernameStoraged;
    username = usernameStoraged;
    chatSendButton.removeAttribute('disabled');
  }
}

function initializeSocketClient() {
  if (!socketClient) {
    socketClient = (0, _socket.io)('http://localhost:3333');
    socketClient.on('getMessages', function (data) {
      messages = data;
      handleSetMessages(messages);
    });
  }
}

function handleUsernameInputBlur(event) {
  var target = event.target;

  if (!target) {
    return;
  }

  var _ref = target,
      value = _ref.value;
  var sendMessageButton = document.getElementById('sendMessageButton');

  if (value !== '') {
    sendMessageButton.removeAttribute('disabled');
    username = value;
    localStorage.setItem('username', value);
  } else {
    sendMessageButton.setAttribute('disabled', '');
    username = '';
  }
}

function handleChatFormSubmit(event) {
  event.preventDefault();
  var target = event.target;
  var formData = new FormData(target);
  var message = formData.get('message');

  if (!socketClient) {
    return;
  }

  socketClient.emit('sendMessage', _objectSpread({
    message: message.trim(),
    username: username
  }, colors));
  target.reset();
}

function handleColorPickerBlur(event) {
  var target = event.target;
  var id = target.id,
      value = target.value;
  colors[id] = value;
  localStorage.setItem(id, value);
}

usernameInput.addEventListener('blur', handleUsernameInputBlur);
chatForm.addEventListener('submit', handleChatFormSubmit);
Array.from(colorPickerInputs).forEach(function (element) {
  element.addEventListener('blur', handleColorPickerBlur);
});
initializeSocketClient();
initializeStoragedData();