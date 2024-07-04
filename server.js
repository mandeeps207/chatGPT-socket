import 'dotenv/config';
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import session from 'express-session';
import path from 'path';

// Initiating socket server
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// server static files
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public')));

// handle socket middlewares
const sessionMiddleware = session({
  secret: process.env.SESSION_KEY,
  resave: true,
  saveUninitialized: true,
  cookie: {
      sameSite: 'strict', // Add SameSite attribute
  } 
});
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(sessionMiddleware);
io.engine.use(sessionMiddleware);

// Serve homepage template
app.get('/', (req, res) => {
  res.render('index');
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
