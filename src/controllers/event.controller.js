import { eventService } from '../services/event.service.js';


export const registerToEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id; // Extraído por passportCall('jwt')

    const updatedEvent = await eventService.registerToEvent(eventId, userId);

    res.status(200).json({
      status: 'success',
      message: 'Inscripción realizada con éxito',
      payload: updatedEvent
    });
  } catch (error) {
    next(error);
  }
};


export const getEvents = async (req, res, next) => {
  try {
    const events = await eventService.getAllEvents();
    res.status(200).json({ status: 'success', payload: events });
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const event = await eventService.getEventById(eventId);
    res.status(200).json({ status: 'success', payload: event });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    // req.user proviene del middleware passportCall('jwt')
    const userId = req.user.id;
    const newEvent = await eventService.createEvent(req.body, userId);
    res.status(201).json({ status: 'success', payload: newEvent });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    
    // Si el middleware isEventOwnerOrAdmin guardó req.event, se pasa al servicio
    const updatedEvent = await eventService.updateEvent(eventId, req.body, req.event);
    
    res.status(200).json({ 
      status: 'success', 
      payload: updatedEvent 
    });
  } catch (error) {
    next(error);
  }
};

export const cancelEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    
    // Se reutiliza req.event para validar el estado antes de cancelar
    const cancelledEvent = await eventService.cancelEvent(eventId, req.event);
    
    res.status(200).json({ 
      status: 'success', 
      message: 'Evento cancelado exitosamente', 
      payload: cancelledEvent 
    });
  } catch (error) {
    next(error);
  }
};