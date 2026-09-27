import { z } from 'zod';

export const registerSchema = z.object({
  first_name: z
    .string({ required_error: 'El nombre es obligatorio' })
    .min(1, 'El nombre no puede estar vacío')
    .trim(),
  
  last_name: z
    .string({ required_error: 'El apellido es obligatorio' })
    .min(1, 'El apellido no puede estar vacío')
    .trim(),

  email: z
    .string({ required_error: 'El email es obligatorio' })
    .email('El formato del correo electrónico no es válido')
    .toLowerCase()
    .trim(),

  password: z
    .string({ required_error: 'La contraseña es obligatoria' })
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'El email es obligatorio' })
    .email('El formato del correo electrónico no es válido')
    .toLowerCase()
    .trim(),

  password: z
    .string({ required_error: 'La contraseña es obligatoria' })
    .min(1, 'La contraseña no puede estar vacía')
});