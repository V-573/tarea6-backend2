
import {eventDAO} from '../dao/event.dao.js'
import { userDAO } from '../dao/user.dao.js';
import { eventModel } from '../models/event.model.js';
class EventRepository {

async registerAttendee(eventId, userId) {
  return await eventDAO.addAttendee(eventId, userId);
}

async cancelEvent(id) {
  return await eventDAO.updateStatus(id, 'cancelled');
}




// src/repositories/event.repository.js

async getAllEvents({ filter = {}, options = {} }) {
  const { page = 1, limit = 10, sort = { date: 1 } } = options;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    eventModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    eventModel.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(total / limit) || 1;

  return {
    data,
    page,
    limit,
    total,
    totalPages
  };
}

  async getEventById(id) {
    return await eventDAO.getById(id);
  }

  async checkSiteAvailability(location, date, time) {
    return await eventDAO.findByLocationAndSchedule(location, date, time);
  }

  async createEvent(eventData) {
    return await eventDAO.create(eventData);
  }

  async updateEvent(id, updateData) {
    return await eventDAO.update(id, updateData);
  }
}

export const eventRepository = new EventRepository();