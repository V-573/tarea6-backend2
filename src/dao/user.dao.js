import { UserModel } from "../models/user.model.js";

class UserDAO{
async getAll() {
    // Excluye la contraseña y usa .lean() para devolver objetos planos JS
    return await UserModel.find({}, '-password').lean();
  }

    async getByEmail(email){
        return await UserModel.findOne({email});

    }

    async create(userData){
        return await UserModel.create(userData);
    }


}

export const userDAO = new UserDAO();