import {Schema, model} from 'mongoose';
import { UserModel } from './user.model.js';

const eventCollection = 'events';

const eventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true }, // Reserva de sitio / Lugar
  date: { type: String, required: true },     // Formato YYYY-MM-DD
  time: { type: String, required: true },     // Formato HH:mm
  organizerId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['active', 'cancelled'], 
    default: 'active' 
  },
  // ◄── Campo de inscripciones
  attendees: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

export const eventModel = model(eventCollection, eventSchema);