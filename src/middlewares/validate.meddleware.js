
export const validateBody = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body); // Si falla, salta al catch como ZodError
    next();
  } catch (error) {
    next(error); // ──► Pasa a errorHandler directamente
  }
};