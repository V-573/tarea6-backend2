import { eventRepository } from '../repositories/event.repository.js';
import { CustomError } from '../utils/customError.util.js';

class EventService {

  async registerToEvent(eventId, userId) {
    const event = await this.getEventById(eventId);

    // Validar que el evento esté publicado para aceptar inscripciones
    if (event.status !== 'published') {
      throw new CustomError('Solo puedes inscribirte a eventos publicados', 400);
    }

    // Validar capacidad de asistentes
    if (event.attendees && event.attendees.length >= event.capacity) {
      throw new CustomError('El evento ha alcanzado su capacidad máxima', 400);
    }

    // Validar que el usuario no esté inscrito previamente
    const isAlreadyRegistered = event.attendees?.some(
      (attendee) => (attendee._id || attendee).toString() === userId.toString()
    );

    if (isAlreadyRegistered) {
      throw new CustomError('Ya te encuentras inscrito en este evento', 409);
    }

    return await eventRepository.registerAttendee(eventId, userId);
  }



  async getAllEvents() {
    return await eventRepository.getAllEvents();
  }

  async getEventById(id) {
    const event = await eventRepository.getEventById(id);
    if (!event) {
      throw new CustomError('Evento no encontrado', 404);
    }
    return event;
  }

  async createEvent(eventData, userId) {
    const { title, description, category, location, date, time, capacity, price, status } = eventData;

    // Validar disponibilidad del sitio en esa fecha y hora
    const existingReservation = await eventRepository.checkSiteAvailability(location, date, time);
    if (existingReservation) {
      throw new CustomError('El sitio ya se encuentra reservado para esa fecha y hora', 409);
    }

    const newEvent = await eventRepository.createEvent({
      title,
      description,
      category,
      location,
      date,
      time,
      capacity,
      price,
      status,
      organizer: userId
    });

    return newEvent;
  }

async cancelEvent(eventId, currentEvent = null) {
    // Reutiliza el evento cargado o realiza la búsqueda en BD si no existe
    const event = currentEvent || await this.getEventById(eventId);

    if (event.status === 'cancelled') {
      throw new CustomError('El evento ya se encuentra cancelado', 400);
    }

    return await eventRepository.cancelEvent(eventId);
  }

  async updateEvent(eventId, updateData, currentEvent = null) {
    // Si se intentan cambiar fecha, hora o lugar, validamos disponibilidad
    if (updateData.location || updateData.date || updateData.time) {
      
      const eventToUpdate = currentEvent || await this.getEventById(eventId);
      
      const location = updateData.location || eventToUpdate.location;
      const date = updateData.date || eventToUpdate.date;
      const time = updateData.time || eventToUpdate.time;

      const existingReservation = await eventRepository.checkSiteAvailability(location, date, time);
      
      // Si existe una reserva con misma ubicación/fecha/hora y pertenece a OTRO evento
      if (existingReservation && existingReservation._id.toString() !== eventId) {
        throw new CustomError('El nuevo sitio/horario ya está reservado por otro evento', 409);
      }
    }

    return await eventRepository.updateEvent(eventId, updateData);
  }



}

export const eventService = new EventService();