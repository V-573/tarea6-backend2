
import {eventDAO} from '../dao/event.dao.js'
import { userDAO } from '../dao/user.dao.js';
class EventRepository {

async registerAttendee(eventId, userId) {
  return await eventDAO.addAttendee(eventId, userId);
}

async cancelEvent(id) {
  return await eventDAO.updateStatus(id, 'cancelled');
}




  async getAllEvents() {
    return await eventDAO.getAll();
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