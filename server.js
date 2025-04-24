const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const cors = require('cors');
const Document = require('./models/Document');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());

mongoose.connect('mongodb://localhost:27017/realtime-docs', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

io.on('connection', socket => {
  socket.on('join-doc', async docId => {
    socket.join(docId);
    const document = await findOrCreateDocument(docId);
    socket.emit('load-document', document.data);

    socket.on('send-changes', delta => {
      socket.broadcast.to(docId).emit('receive-changes', delta);
    });

    socket.on('save-document', async data => {
      await Document.findByIdAndUpdate(docId, { data });
    });
  });
});

async function findOrCreateDocument(id) {
  if (!id) return;
  const document = await Document.findById(id);
  if (document) return document;
  return await Document.create({ _id: id, data: '' });
}

server.listen(5000, () => console.log('Server running on http://localhost:5000'));