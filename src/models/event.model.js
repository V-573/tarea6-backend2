import { Schema, model } from 'mongoose';

const eventCollection = 'events';

const eventSchema = new Schema({
  title: { 
    type: String, 
    required: [true, 'El título es obligatorio'] 
  },
  description: { 
    type: String, 
    required: [true, 'La descripción es obligatoria'] 
  },
  category: { 
    type: String, 
    required: [true, 'La categoría es obligatoria'] 
  },
  location: { 
    type: String, 
    required: [true, 'La ubicación es obligatoria'] 
  },
  date: { 
    type: String, 
    required: [true, 'La fecha es obligatoria'] 
  },
  time: { 
    type: String, 
    required: [true, 'La hora es obligatoria'] 
  },
  capacity: { 
    type: Number, 
    required: [true, 'La capacidad es obligatoria'],
    min: [1, 'La capacidad debe ser mayor a 0'] 
  },
  price: { 
    type: Number, 
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio debe ser mayor o igual a 0'] 
  },
  status: { 
    type: String, 
    enum: {
      values: ['draft', 'published', 'cancelled', 'finished'],
      message: '{VALUE} no es un estado válido'
    },
    default: 'draft' 
  },
  organizer: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'El organizador es obligatorio'] 
  },
  attendees: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

export const eventModel = model(eventCollection, eventSchema);