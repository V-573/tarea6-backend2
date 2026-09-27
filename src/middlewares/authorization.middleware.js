import { CustomError } from '../utils/customError.util.js';

/**
 * Recibe una lista de roles permitidos (ej. ['admin', 'organizer'])
 */
export const authorization = (allowedRoles = []) => {
  return (req, res, next) => {
    // 1. Verificación de seguridad: req.user debe existir (debe pasar primero por passportCall('jwt'))
    if (!req.user) {
      return next(new CustomError('No autenticado: sesión no encontrada', 401));
    }

    // 2. Normalizamos la lista de roles por si se envía un único string ej. authorization('admin')
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    // 3. Verificamos si el rol del usuario está dentro de los permitidos
    if (!roles.includes(req.user.role)) {
      return next(new CustomError('Acceso denegado: permisos insuficientes', 403));
    }

    // 4. Si coincide el rol, pasa al siguiente handler
    next();
  };
};