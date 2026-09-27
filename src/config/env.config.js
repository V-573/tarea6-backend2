import dotenv from 'dotenv';

// Cargar las variables del archivo .env al objeto process.env
dotenv.config();

// Agregamos MONGO_URI como variable requerida
const requiredEnvs = ['PORT', 'NODE_ENV', 'MONGO_URI'];
const missingEnvs = [];

// Validar que existan
requiredEnvs.forEach((envName) => {
  if (!process.env[envName]) {
    missingEnvs.push(envName);
  }
});

if (missingEnvs.length > 0) {
  console.error(`❌ ERROR CRÍTICO: Faltan las siguientes variables de entorno: ${missingEnvs.join(', ')}`);
  process.exit(1); // Detiene la ejecución del nodo por completo
}

export const env = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET || 'secret_fallback',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h'

};