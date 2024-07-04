import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import sessionMiddleware from './models/session.js';
import path from 'path';

// Initiating socket server
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// server static files
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public')));

// handle socket middlewares

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(sessionMiddleware);

// Share session middleware with Socket.IO
io.engine.use(sessionMiddleware);

// Serve homepage template
app.get('/', (req, res) => {
  const session = req.session;
  res.render('index', {session});
});

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
  const sessionId = socket.request.session.id;
  console.log(sessionId);
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

const port = process.env.PORT || 3000;
httpServer.listen(port, () => {
  console.log(`listening on *:${port}`);
});
