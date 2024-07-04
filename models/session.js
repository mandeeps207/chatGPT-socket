import 'dotenv/config';
import session from 'express-session';
import MongoStore from 'connect-mongo';

// Create session middleware
const sessionMiddleware = session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 14 * 24 * 60 * 60, // = 14 days. Default
        dbName: 'socketio-chat-app',
        collectionName: 'sessions',
        stringify: false,
    }),
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.COOKIE_PARAM || false, // Use secure cookies in production
        maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days in milliseconds
    },
});

// Export the session middleware
export default sessionMiddleware;