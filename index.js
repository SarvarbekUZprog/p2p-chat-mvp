const WebSocket = require('ws');
const express = require('express');
const { randomUUID } = require('crypto');

const app = express();
const server = app.listen(3000, () => console.log('Server running'));
const wss = new WebSocket.Server({ server });

let clients = {};

wss.on('connection', ws => {
  const userId = randomUUID();
  clients[userId] = ws;

  ws.send(JSON.stringify({ type: 'your-id', id: userId }));

  ws.on('message', msg => {
    const data = JSON.parse(msg);
    if (data.type === 'signal' && clients[data.to]) {
      clients[data.to].send(JSON.stringify(data));
    }
  });

  ws.on('close', () => {
    delete clients[userId];
  });
});
