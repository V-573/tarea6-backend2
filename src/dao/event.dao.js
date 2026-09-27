import { eventModel } from '../models/event.model.js';

class EventDAO {
async addAttendee(eventId, userId) {
  return await eventModel.findByIdAndUpdate(
    eventId,
    { $addToSet: { attendees: userId } },
    { returnDocument: 'after' }
  ).populate('attendees', 'first_name last_name email');
}

  async updateStatus(id, status) {
  return await eventModel.findByIdAndUpdate(
    id, 
    { status }, 
    { returnDocument: 'after' }
  );
}

  
  async getAll() {
    return await eventModel.find().populate('organizerId', 'first_name last_name email');
  }

  async getById(id) {
    return await eventModel.findById(id).populate('organizerId', 'first_name last_name email');
  }

  async findByLocationAndSchedule(location, date, time) {
    // Busca si ya hay un evento activo reservando el mismo sitio a la misma fecha y hora
    return await eventModel.findOne({ location, date, time, status: 'active' });
  }

  async create(eventData) {
 const newEvent = await eventModel.create(eventData);
  // Puebla el campo organizerId antes de retornar la respuesta al cliente
  return await newEvent.populate('organizerId', 'first_name last_name email');
  }

  async update(id, updateData) {
    return await eventModel.findByIdAndUpdate(id, updateData, { returnDocument: 'after' });
  }

  async delete(id) {
    return await eventModel.findByIdAndDelete(id);
  }
}

export const eventDAO = new EventDAO();