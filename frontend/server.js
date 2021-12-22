import express from 'express';
import { createServer } from 'https';

import { sendView } from './js/misc.js';
import redirects from './routes/redirects.js';
import callRouter from './routes/call.js';
import imgRouter from './routes/img.js';
import {
	sessionCreationMiddleware,
	sessionVerificationMiddleware,
} from './middleware/session.js';
import { initSocketServer, socketLogic } from './js/sockets.js';
import fs from 'fs';
import config from './public/config/config.js';
import cors from 'cors';

// Constante
const PORT = process.env.PORT || config.PORT;

// Initializari
const options = {
	key: fs.readFileSync('key.pem'),
	cert: fs.readFileSync('cert.pem'),
};

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const app = express();
const httpServer = createServer(options, app);
const io = initSocketServer(httpServer);

// Configurari
app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(sessionCreationMiddleware);
app.use('/call', callRouter);
app.use('/img', imgRouter);
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
