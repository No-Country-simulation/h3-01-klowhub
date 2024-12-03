import express from 'express';
import session from "express-session";
import configurePassport from './config/passport';
import dotenv from 'dotenv';
import cors from 'cors'
import passport from 'passport';
import routes from './routes';
import path from 'path';

dotenv.config();

const app = express();

app.use(
    session({
      secret: process.env.SESSION_SECRET || "default_secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
      },
    })
);
app.use(passport.initialize());
app.use(passport.session()); // Habilitar sesiones para Passport

configurePassport(passport);

app.use(express.json());
app.use(cors());
app.use(passport.initialize());

app.get('/', (req, res) => {
    res.send('Bienvenido a la API');
});

app.use('/api', routes);
app.use('/static/images', express.static(path.join(__dirname, '..', 'public', 'images')));

export default app;
