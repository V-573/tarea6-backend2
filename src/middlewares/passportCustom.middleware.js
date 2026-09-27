// middlewares/passportCustom.middleware.js
import passport from 'passport';
import { CustomError } from '../utils/customError.util.js';

export const passportCall = (strategy) => {
  return (req, res, next) => {
    passport.authenticate(strategy, { session: false }, (err, user, info) => {
      if (err) return next(err); // ──► Si la estrategia falló con un CustomError, lo pasa a errorHandler
      
    // 2. Si no hay usuario (token expirado, alterado o inexistente)
      if (!user) {
        let message = 'No autorizado';

        // Detectar fallos específicos de JsonWebToken
        if (info && info.name === 'TokenExpiredError') {
          message = 'El token ha expirado';
        } else if (info && info.name === 'JsonWebTokenError') {
          message = 'Token inválido o manipulado';
        } 
        // else if (info && info.message) {
        //   message = info.message;
        // }

        // Enviamos el CustomError directamente a errorHandler
        return next(new CustomError(message, 401));
      }
      // 3. Autenticación exitosa
      req.user = user;
      next();
    })(req, res, next);
  };
};