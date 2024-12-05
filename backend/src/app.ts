import express from 'express';
import configurePassport from './config/passport';
import cors from 'cors'
import passport from 'passport';
import routes from './routes';
import path from 'path';

const app = express();

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
