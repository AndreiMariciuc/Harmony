import session from 'express-session';
import { sendView } from '../js/misc.js';

const SECRET = process.env.SECRET || 'keyboard cat';

const sessionCreationMiddleware = session({
	secret: SECRET,
	resave: false,
	saveUninitialized: false,
});

const sessionVerificationMiddleware = (req, res, next) => {
	const session = req.session;
	// console.log(session);

	if (session.userId) return sendView(res, 'home');

	next();
};

export { sessionCreationMiddleware, sessionVerificationMiddleware };
