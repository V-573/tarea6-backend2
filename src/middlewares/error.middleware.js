import { ZodError } from "zod";
export const errorHandler = (err, req, res, next)=>{
    // 1. Manejo especial de errores de validación de Zod
  if (err instanceof ZodError) {
    const formattedErrors = (err.issues || []).map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message
    }));

    return res.status(400).json({
      status: 'error',
      message: 'Error de validación en la petición',
      errors: formattedErrors
    });
  }

  // 2. Manejo de errores controlados (CustomError o errores con statusCode)
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  // Registrar el error en consola para depuración
  console.error(`[Error] ${req.method} ${req.url} - Status: ${statusCode} - ${message}`);

  return res.status(statusCode).json({
    // status: 'error',
    status: 'error',
    message: statusCode === 500 ? 'Error interno del servidor' : message
  });
}