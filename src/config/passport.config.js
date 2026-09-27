import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';
import { userService } from '../services/user.service.js';
import {env} from './env.config.js'
import { CustomError } from '../utils/customError.util.js';


/**
 * Función extractor personalizada para obtener el JWT desde la cookie
 */
const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.token || req.cookies.currentUser;
  }
  return token;
};



export const initializePassport = () => {
    // Estrategia de login
  passport.use(
    'login',
    new LocalStrategy(
      {
        // Reasignamos el nombre del campo a 'email' (por defecto Passport busca 'username')
        usernameField: 'email',
        passwordField: 'password',
        session: false // Desactivamos sesiones persistentes (ya que usamos JWT)
      },
      async (email, password, done) => {
        try {
             // 1. Buscar usuario en la base de datos
          const result = await userService.loginUser({email, password});
      
          return done(null, result);
        } catch (error) {
 //return done(null, false, { message: error.message });

 console.log(error.message) // puedo capturar el error desde service pero aun no logro enviarlopor done...
        // return done(null, false, {message: error.message});
        return done(error);
        }
       
      }
    )
  );

  // Estrategia de Registro
  passport.use(
    'register',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true, // Permite acceder a req.body para leer first_name, last_name, etc.
        session: false
      },
      async (req, email, password, done) => {
        try {
          // Delegamos la creación al Service existente
          const newUser = await userService.registerUser(req.body);
          
          // Si fue exitoso, pasamos el usuario creado a Passport
          return done(null, newUser);
        } catch (error) {
          // Captura errores de negocio (ej. 409 Email ya registrado) y los pasa a Passport
          return done(error);
        }
      }
    )
  );

// Estrategia 'jwt' para rutas protegidas
  passport.use(
    'jwt',
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: env.JWT_SECRET
      },
      async (jwt_payload, done) => {
        try {
          // jwt_payload contiene los datos codificados en el token { id, email, role }
          if (!jwt_payload) {
          // Si por alguna razón el payload está vacío
            return done(new CustomError('Token no válido', 401));
          }

          // Retornamos el payload para que Passport lo asigne automáticamente a req.user
          return done(null, jwt_payload);
        } catch (error) {
          console.log(error)
         return done(error);
           // return done(error);
        }
      }
    )
  );
  



};

