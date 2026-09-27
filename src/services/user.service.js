import { userRepository } from "../repositories/user.repository.js";
import { hashPassword, comparePassword } from "../utils/crypto.util.js";
import { CustomError } from "../utils/customError.util.js";
import { generateToken } from "../utils/jwt.util.js";

class UserService {



  
  async registerUser(userData) {
    // req.body ya viene validado y formateado por Zod
    const { first_name, last_name, email, password } = userData;

    // Solo se ejecutan verificaciones de lógica de negocio (BD)
    const userExists = await userRepository.getByEmail(email);
    if (userExists) {
      // const error = new Error('Ya existe un usuario registrado con ese email');
      // error.statusCode = 409;
      // throw error;

      throw new CustomError(
        "Ya existe un usuario registrado con ese email",
        409,
      );
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await userRepository.createUser({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role: "user",
    });

    return {
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      role: newUser.role,
    };
  }


    async getAllUsers() {
    const users = await userRepository.getAllUsers();
    
    // Retornamos la lista formateada (doble capa de protección contra contraseñas)
    return users.map(user => ({
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role
    }));
  }



  async loginUser(credentials) {
    const { email, password } = credentials;

    const user = await userRepository.getByEmail(email);
    if (!user) {
      // const error = new Error('Credenciales inválidas');
      // error.statusCode = 401;
      // throw error;
      throw new CustomError("Credenciales invalidas", 401);
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      // const error = new Error('Credenciales inválidas');
      // error.statusCode = 401;
      // throw error;
      throw new CustomError(
        "Credenciales invalidas", 
        401);
    }

    // Crear el payload para el JWT (NO incluir contraseñas ni datos sensibles)
    const tokenPayload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    // Generar el token JWT
    const token = generateToken(tokenPayload);
    // Retornar los datos del usuario junto con el token

    return {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }
}

export const userService = new UserService();
