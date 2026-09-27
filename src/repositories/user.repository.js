import { userDAO } from '../dao/user.dao.js';

class UserRepository {




async createUser(userData){
    return await userDAO.create(userData)
}


  async getAllUsers() {
return await userDAO.getAll();
  }


  async getByEmail(email) {
    // Aquí podrías primero buscar en caché, y si no está, ir al DAO
    return await userDAO.getByEmail(email);
  }
}
export const userRepository = new UserRepository();