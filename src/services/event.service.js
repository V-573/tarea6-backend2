import { eventRepository } from '../repositories/event.repository.js';
import { CustomError } from '../utils/customError.util.js';

class EventService {

  /**
   * Helper para verificar si una fecha (y hora opcional) está en el pasado
   */
  #isPastDate(date, time = '00:00') {
    const eventDateTime = new Date(`${date}T${time}`);
    return eventDateTime < new Date();
  }

  /**
   * Helper para validar valores numéricos y reglas de estado/fecha
   */
  #validateEventBusinessRules({ date, time, capacity, price, status }, currentEvent = null) {
    // 1. Rechazar capacity <= 0 (si se proporciona)
    if (capacity !== undefined && (typeof capacity !== 'number' || capacity <= 0)) {
      throw new CustomError('La capacidad del evento debe ser un número mayor a 0', 400);
    }

    // 2. Rechazar price < 0 (si se proporciona)
    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
      throw new CustomError('El precio del evento no puede ser negativo', 400);
    }

    // 3. No permitir fecha pasada al crear o actualizar fecha/hora
    const targetDate = date || currentEvent?.date;
    const targetTime = time || currentEvent?.time || '00:00';
    if (targetDate && this.#isPastDate(targetDate, targetTime)) {
      throw new CustomError('No se pueden programar eventos en una fecha u hora pasada', 400);
    }

    // 4. No permitir publicar eventos ya finalizados o cancelados
    const newStatus = status;
    const currentStatus = currentEvent?.status;

    if (newStatus === 'published') {
      if (currentStatus === 'cancelled' || currentStatus === 'finished') {
        throw new CustomError(`No se puede publicar un evento que está ${currentStatus}`, 400);
      }
      if (targetDate && this.#isPastDate(targetDate, targetTime)) {
        throw new CustomError('No se puede publicar un evento cuya fecha ya ha pasado', 400);
      }
    }
  }

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

    // Validaciones de negocio
    this.#validateEventBusinessRules({ date, time, capacity, price, status });

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
      status: status || 'draft',
      organizer: userId
    });

    return newEvent;
  }

  async cancelEvent(eventId, currentEvent = null) {
    const event = currentEvent || await this.getEventById(eventId);

    if (event.status === 'cancelled') {
      throw new CustomError('El evento ya se encuentra cancelado', 400);
    }

    return await eventRepository.cancelEvent(eventId);
  }

  async updateEvent(eventId, updateData, currentEvent = null) {
    const eventToUpdate = currentEvent || await this.getEventById(eventId);

    // Validaciones de negocio asociando los datos a actualizar con el estado actual
    this.#validateEventBusinessRules(updateData, eventToUpdate);

    // Si se intentan cambiar fecha, hora o lugar, validamos disponibilidad
    if (updateData.location || updateData.date || updateData.time) {
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