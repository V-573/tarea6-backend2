import { userService } from "../services/user.service.js";



export const register = async (req, res, next) => {
  try {
    // const userPayload = await userService.registerUser(req.body); le doy manejo desde passport
    // req.user contiene lo que devolvió done(null, newUser) desde la estrategia
    res.status(201).json({
      status: "success",
      message: "Usuario registrado correctamente",
      payload: {
        id: req.user._id || req.user.id,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    // Pasa el error al middleware global de errores
    // res.status(error.statusCode || 500).json({
    //   status: 'error',
    //   message: error.message || 'Error interno del servidor'
    // });
    next(error);
  }
};


export const getUsersList = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      status: 'success',
      payload: users
    });
  } catch (error) {
    next(error); // Pasa el error a tu middleware global de errores
  }
};

export const login = async (req, res, next) => {
  try {
    const { user, token } = req.user;

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: "success",
      message: "Inicio de sesión exitoso",
      payload: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/sessions/current
export const getCurrentUser = async (req, res, next) => {
  try {
// req.user es asignado automáticamente por passportCall('jwt')
    res.status(200).json({
      status: "success",
      payload: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    // Limpia la cookie especificando el mismo nombre con el que se creó
    // res.clearCookie("token");
    // res.clearCookie("currentUser"); // Si usaste este nombre

    // Limpia la cookie especificando las mismas opciones con las que se creó
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    res.status(200).json({
      status: "success",
      message: "Sesión cerrada correctamente",
    });
  } catch (error) {
    next(error);
  }
};
