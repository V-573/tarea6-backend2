import { eventRepository } from '../repositories/event.repository.js';
import { CustomError } from '../utils/customError.util.js';

class EventService {

async registerToEvent(eventId, userId) {
  const event = await this.getEventById(eventId);

  // 1. Validar estado del evento
  if (event.status === 'cancelled') {
    throw new CustomError('No puedes inscribirte a un evento cancelado', 400);
  }

  // 2. Validar que el usuario no esté inscrito previamente
  const isAlreadyRegistered = event.attendees?.some(
    (attendee) => (attendee._id || attendee).toString() === userId.toString()
  );

  if (isAlreadyRegistered) {
    throw new CustomError('Ya te encuentras inscrito en este evento', 409);
  }

  return await eventRepository.registerAttendee(eventId, userId);
}


async cancelEvent(eventId) {
  const event = await this.getEventById(eventId);

  if (event.status === 'cancelled') {
    throw new CustomError('El evento ya se encuentra cancelado', 400);
  }

  return await eventRepository.cancelEvent(eventId);
}


  async getAllEvents() {
    return await eventRepository.getAllEvents();
  }

  async getEventById(id) {

    // 1. Buscar en la base de datos
    const event = await eventRepository.getEventById(id);
    if (!event) {
      throw new CustomError('Evento no encontrado', 404);
    }
    return event;
  }

  async createEvent(eventData, userId) {
    const { title, description, location, date, time } = eventData;

    // Lógica de negocio: Validar que el sitio no esté reservado en esa fecha y hora
    const existingReservation = await eventRepository.checkSiteAvailability(location, date, time);
    if (existingReservation) {
      throw new CustomError('El sitio ya se encuentra reservado para esa fecha y hora', 409);
    }

    const newEvent = await eventRepository.createEvent({
      title,
      description,
      location,
      date,
      time,
      organizerId: userId
    });

    return newEvent;
  }

  async updateEvent(eventId, updateData) {
    // Si se intentan cambiar fecha/hora/sitio, validamos disponibilidad de nuevo
    if (updateData.location || updateData.date || updateData.time) {
      const eventToUpdate = await this.getEventById(eventId);
      const location = updateData.location || eventToUpdate.location;
      const date = updateData.date || eventToUpdate.date;
      const time = updateData.time || eventToUpdate.time;

      const existingReservation = await eventRepository.checkSiteAvailability(location, date, time);
      if (existingReservation && existingReservation._id.toString() !== eventId) {
        throw new CustomError('El nuevo sitio/horario ya está reservado por otro evento', 409);
      }
    }

    return await eventRepository.updateEvent(eventId, updateData);
  }
}

export const eventService = new EventService();