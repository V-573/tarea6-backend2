import mongoose from 'mongoose';
import dns from 'dns';
import { env } from './env.config.js';

// Fuerza a Node.js a usar servidores DNS estándar y resolver primero IPv4
dns.setServers(['8.8.8.8', '8.8.4.4']);

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log('✅ MongoDB conectado exitosamente');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};