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
    return await eventModel.find().populate('organizer', 'first_name last_name email');
  }

  async getById(id) {
    return await eventModel.findById(id).populate('organizer', 'first_name last_name email');
  }

  async findByLocationAndSchedule(location, date, time) {
    // Solo considera reservados los eventos que no estén cancelados ni terminados
    return await eventModel.findOne({ 
      location, 
      date, 
      time, 
      status: { $nin: ['cancelled', 'finished'] } 
    });
  }

  async create(eventData) {
    const newEvent = await eventModel.create(eventData);
    return await newEvent.populate('organizer', 'first_name last_name email');
  }

  async update(id, updateData) {
    return await eventModel.findByIdAndUpdate(id, updateData, { returnDocument: 'after', runValidators: true });
  }

  async delete(id) {
    return await eventModel.findByIdAndDelete(id);
  }
}

export const eventDAO = new EventDAO();