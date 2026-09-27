import { Router } from 'express';
import { passportCall } from '../middlewares/passportCustom.middleware.js';
import { authorization } from '../middlewares/authorization.middleware.js';
import { isEventOwnerOrAdmin } from '../middlewares/owner.middleware.js';
import { 
  getEvents, 
  createEvent, 
  updateEvent, 
  getEventById,
  cancelEvent,
  registerToEvent
} from '../controllers/event.controller.js';

const router = Router();

// Consultar eventos -> Público (user, organizer, admin o sin autenticar)
router.get('/', getEvents);


// Crear evento -> organizer y admin
router.post(
  '/', 
  passportCall('jwt'), 
  authorization(['organizer', 'admin']), 
  createEvent
);


router.get('/:eventId', getEventById);

// Modificar/Cancelar evento -> organizer (propios) y admin (cualquiera)
router.put(
  '/:eventId', 
  passportCall('jwt'), 
  authorization(['organizer', 'admin']), 
  isEventOwnerOrAdmin, 
  updateEvent
);


// Cancelar evento -> organizer (propios) y admin (cualquiera)
router.delete(
  '/:eventId', 
  passportCall('jwt'), 
  authorization(['organizer', 'admin']), 
  isEventOwnerOrAdmin, 
  cancelEvent
);

// Inscribirse a un evento -> Solo usuarios con rol 'user'
router.post(
  '/:eventId/register', 
  passportCall('jwt'), 
  authorization(['user']), 
  registerToEvent
);

export default router;