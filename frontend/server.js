import express from 'express';
import { createServer } from 'http';

import { sendView } from './js/misc.js';
import redirects from './routes/redirects.js';
import {
	sessionCreationMiddleware,
	sessionVerificationMiddleware,
} from './middleware/session.js';
import { initSocketServer, socketLogic } from './js/sockets.js';

// Constante
const PORT = process.env.PORT || 3000;

// Initializari
const app = express();
const httpServer = createServer(app);
const io = initSocketServer(httpServer);

// Configurari
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(sessionCreationMiddleware);
app.use(sessionVerificationMiddleware);
app.use('/', redirects);

io.use((socket, next) => {
	sessionCreationMiddleware(socket.request, socket.request.res || {}, next);
});

// Cod
app.get('/', (req, res) => sendView(res, 'login'));
app.get('/register', (req, res) => sendView(res, 'register'));

io.on('connection', socketLogic);

httpServer.listen(PORT, _ => console.log(`Listening on port ${PORT} !`));
