// src/middlewares/owner.middleware.js
import { CustomError } from '../utils/customError.util.js';
import { eventService } from '../services/event.service.js';

export const isEventOwnerOrAdmin = async (req, res, next) => {
  try {
    const { id: userId, role } = req.user;
    const { eventId } = req.params;

    // 1. Buscar el evento en la BD primero para adjuntarlo a req.event
    const event = await eventService.getEventById(eventId);
    if (!event) {
      return next(new CustomError('Evento no encontrado', 404));
    }

    // Guardamos el evento en la request para evitar re-consultarlo en el controlador/servicio
    req.event = event;

    // 2. El Admin se salta la comprobación de autoría
    if (role === 'admin') {
      return next();
    }

    // 3. Extraer el ID del organizador soportando tanto Objetos Poblados como ObjectIds planos
    const organizerId = event.organizer?._id 
      ? event.organizer._id.toString() 
      : event.organizer?.toString();

    // 4. Validar si el ID del creador coincide con el usuario autenticado
    if (!organizerId || organizerId !== userId.toString()) {
      return next(new CustomError('No tienes permiso para modificar este evento', 403));
    }

    next();
  } catch (error) {
    next(error);
  }
};