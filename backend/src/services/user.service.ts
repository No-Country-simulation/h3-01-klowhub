import { UserModel } from "../models";
import { UserDTO } from "../dtos/user.dto";
import { MESSAGES } from "../utils/messages";
import bcrypt from "bcryptjs";
import sequelize from "../config/database";

export const findUserDTOByPk = async (id: string): Promise<UserDTO | null> => {
  try {
    const user = await UserModel.findOne({
      where: { id, isValid: true }  // filtra los usuarios activos solamente
    });

    if (!user) {
      throw new Error(MESSAGES.USER_NOT_FOUND);
    }

    // Construir DTO
    return {
      longName: user.longName,
      email: user.email,
      /* country: user.country,
      imageProfile: user.imageProfile ? user.imageProfile.toString("base64") : undefined, */
    };
  } catch (error: any) {
    if (error.name === "SequelizeConnectionError") {
      throw new Error(MESSAGES.CONNECTION_ERROR);
    }
    throw new Error(`${MESSAGES.FETCH_ERROR} + ${error.message}`);
  }
};


export const updateUserById = async (
  id: string,
  updateData: Partial<UserDTO>,
  password?: string
): Promise<UserModel | null> => {
  const transaction = await sequelize.transaction();

  try {
    const user = await UserModel.findOne({
      where: { id, isValid: true },  // Solo buscamos usuarios activos
      transaction
    });

    if (!user) {
      throw new Error(MESSAGES.USER_NOT_FOUND);
    }

    if (password) {
      validatePassword(password);
      user.password = await encryptPassword(password);
    }/* 
    if (updateData.imageProfile) {
      user.imageProfile = Buffer.from(updateData.imageProfile.split(",")[1], "base64");
    } */

    Object.assign(user, updateData);
    await user.save({ transaction });

    await transaction.commit();
    return user;
  } catch (error: any) {
    await transaction.rollback();
    if (error.name === "SequelizeConnectionError") {
      throw new Error(MESSAGES.CONNECTION_ERROR);
    }
    throw new Error(`${MESSAGES.FETCH_ERROR} | ${error.message}`);
  }
};


export const deactivateUserByPk = async (id: string): Promise<UserModel | null> => {
  try {
    const user = await UserModel.findByPk(id);

    if (!user) {
      throw new Error(MESSAGES.USER_NOT_FOUND);
    }

    // Verifica si ya esta desactivado
    if (!user.isValid) {
      throw new Error('El usuario ya está desactivado');
    }

    // Actualizar estado del usuario (desactivación lógica)
    user.isValid = false;
    await user.save();

    return user;
  } catch (error: any) {
    if (error.name === "SequelizeConnectionError") {
      throw new Error(MESSAGES.CONNECTION_ERROR);
    }
    throw new Error(`${MESSAGES.USER_NOT_FOUND} | ${error.message}`);
  }
};


const validatePassword = (password: string): void => {
  if (password.length < 6) {
    throw new Error("La contraseña debe tener al menos 6 caracteres");
  }
};
const encryptPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};