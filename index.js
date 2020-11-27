require('dotenv').config();
const blessed = require('blessed');
const Redis = require('ioredis');
const chat = require('./chat');

let pubClient = new Redis(process.env.REDIS_URL);
let subClient = new Redis(process.env.REDIS_URL);

pubClient.on('error', function (error) {
  console.log("Couldn't connect to redis");
  console.log("Usage: termchat $redis_url");
  process.exit(0);
})

subClient.on('error', function (error) {
  console.log("Couldn't connect to redis");
  console.log("Usage: termchat $redis_url");
  process.exit(0);
})

const screen = blessed.screen({
  smartCSR: true,
  title: 'Lambda Store Chat 🚀',
});

const initBox = blessed.box({
  label: 'Please input your name',
  top: 'center',
  left: 'center',
  width: '50%',
  height: 3,
  border: {
    type: 'line',
  },
});

const initInput = blessed.textbox({
  parent: initBox,
  inputOnFocus: true,
});

initInput.key('enter', () => {
  const name = initInput.getValue();
  if (!name) return;

  screen.remove(initBox);

  chat({
    screen,
    pubClient,
    subClient,
    name,
  });
});

initInput.key(['C-c'], () => process.exit(0));

screen.append(initBox);
screen.render();
initInput.focus();
