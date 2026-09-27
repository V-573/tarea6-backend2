// src/middlewares/owner.middleware.js
import { CustomError } from '../utils/customError.util.js';
import { eventService } from '../services/event.service.js'; // Asumiendo tu servicio de eventos

export const isEventOwnerOrAdmin = async (req, res, next) => {
  try {
    const { id: userId, role } = req.user;
    const { eventId } = req.params;

    // 1. El Admin se salta la comprobación de autoría
    if (role === 'admin') {
      return next();
    }

    // 2. Buscar el evento en la BD
    const event = await eventService.getEventById(eventId);
    if (!event) {
      return next(new CustomError('Evento no encontrado', 404));
    }

    // 3. Validar si el id del creador coincide con el usuario autenticado
    // Nota: Convierte a string por si req.user.id u organizerId son de tipo ObjectId de MongoDB
    if (event.organizerId.toString() !== userId.toString()) {
      return next(new CustomError('No tienes permiso para modificar este evento', 403));
    }

    // Guardamos el evento en la request para evitar re-consultarlo en el controlador
    req.event = event;
    next();
  } catch (error) {
    next(error);
  }
};