import { UserModel } from "../models";
import { UserProDTO } from "../dtos/user.dto";
import { MESSAGES } from "../utils/messages";
import sequelize from "../config/database";
import UserProModel from "../models/UserPro.model";

export const saveUserPro = async (
  userProData: Partial<UserProDTO>,
  id: string
): Promise<UserProModel | null> => {
  const transaction = await sequelize.transaction();
  try {
    // Verificar si el usuario ya tiene un perfil de vendedor
    const existingUser = await UserModel.findOne({
      where: { id },
      transaction,
    });
    if (!existingUser) {
      const error: any = new Error(MESSAGES.USER_NOT_FOUND);
      error.status = 404;
      throw error;
    }

    if (existingUser.isVendor) {
      const error: any = new Error(
        "Este usuario ya tiene un perfil de vendedor"
      );
      error.status = 400;
      throw error;
    }

    // Actualizar el campo isVendor a true del UserModel básico
    existingUser.isVendor = true;
    await existingUser.save({ transaction });

    const newUserPro = await UserProModel.create(userProData, { transaction });

    await transaction.commit();
    return newUserPro;
  } catch (error: any) {
    await transaction.rollback(); // Revertir cambios ena caso de error
    if (error.name === "SequelizeConnectionError") {
      throw new Error(MESSAGES.CONNECTION_ERROR);
    }
    throw error;
  }
};

export const getUserProByUserId = async (
  userId: string
): Promise<UserProDTO | null> => {
  try {
    if (!userId) {
      const error: any = new Error(MESSAGES.MISSED_DATA);
      error.status = 400;
      throw error;
    }

    const existingUser = await UserProModel.findOne({ where: { userId } });

    if (!existingUser) {
      const error: any = new Error(MESSAGES.USER_NOT_FOUND);
      error.status = 404;
      throw error;
    }

    return existingUser;
  } catch (error: any) {
    if (error.name === "SequelizeConnectionError") {
      throw new Error(MESSAGES.CONNECTION_ERROR);
    }
    throw error;
  }
};

export const updateUserPro = async (
  id: string,
  userData: UserProDTO
): Promise<UserProDTO | null> => {
  try {
    const existingUser = await UserProModel.findOne({
      where: { id, isValid: true },
    });

    if (!existingUser) {
      const existError: any = new Error(MESSAGES.USER_NOT_FOUND);
      existError.status = 404;
      throw existError;
    }

    Object.assign(existingUser, userData);
    await existingUser.save();
    return existingUser;
  } catch (error: any) {
    if (error.name === "SequelizeConnectionError") {
      throw new Error(MESSAGES.CONNECTION_ERROR);
    }
    throw error; // Re-lanza otros errores para que sean manejados por el controller
  }
};

// checa si el userPro es mentor
export const isMentor = async (userId: string): Promise<boolean> => {
  try {
    const user = await UserProModel.findOne({
      where: { userId, isValid: true },
    });

    // Si no existe el usuario o no es mentor, retorna false
    return user?.isMentor ?? false;
  } catch (error) {
    console.error("Error al verificar si el usuario es mentor:", error);
    return false;
  }
};
