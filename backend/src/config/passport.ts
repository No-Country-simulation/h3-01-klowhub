import dotenv from 'dotenv';
dotenv.config();

import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStatic } from 'passport';
import UserModel from '../models/User.model';

interface JwtPayload {
  id: string;
}

export const configurePassport = (passport: PassportStatic) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET not found');
  }

  const Options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret,
  };

  passport.use(
    new Strategy(Options, async (jwtPayload: JwtPayload, done: Function) => {
      try {
        // Aquí buscamos al usuario con el id del JWT
        const user = await UserModel.findOne({ where: { id: jwtPayload.id } });

        if (!user) {
          return done(null, false); // Si no se encuentra el usuario, no se permite la acción
        }

        // Aquí incluimos el usuario en el objeto req.user para que esté disponible en los controladores
        return done(null, user); // El usuario se pasa a req.user automáticamente
      } catch (error) {
        console.error('JWT verification error: ', error);
        return done(error, false);
      }
    })
  );
};

export default configurePassport;
