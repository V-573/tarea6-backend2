import {Router} from 'express';
import passport from 'passport';
import {getCurrentUser, getUsersList, login, logout, register} from '../controllers/session.controller.js'
import { validateBody } from '../middlewares/validate.meddleware.js';
import { loginSchema, registerSchema } from '../schemas/auth.schema.js';
import { passportCall } from '../middlewares/passportCustom.middleware.js';
import { authorization } from '../middlewares/authorization.middleware.js';
// import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();
// Flujo de Registro: Zod -> Passport ('register') -> Controller
router.post('/register',
     validateBody(registerSchema),
     passportCall('register'), register);

// Flujo: 1. Valida formato (Zod) -> 2. Autentica usuario/password (Passport) -> 3. Responde/Cookie (Controller)
router.post('/login', 
    validateBody(loginSchema),
  passportCall('login'),
    login);


// Ruta protegida: authMiddleware se ejecuta primero
router.get('/current',
    //  authMiddleware, - el middleware se deja de usar y se reemplaza por funcionalidad de passport
    passportCall('jwt'), getCurrentUser);


// Ver todos los usuarios -> Solo admin
router.get(
  '/users', 
  passportCall('jwt'), 
  authorization(['admin']), 
  getUsersList
);



router.post('/logout', logout);

export default router;
