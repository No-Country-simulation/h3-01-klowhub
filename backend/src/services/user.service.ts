import { UserModel, UserProModel } from "../models";
import { UserDTO } from "../dtos/user.dto";
import { MESSAGES } from "../utils/messages";
import sequelize from "../config/database";
import { encryptPassword, validatePassword } from "../utils/passwords";
import { Membership } from "../models/enum/enum";
import { Transaction } from "sequelize";

export const findUserDTOByPk = async (id: string): Promise<UserDTO | null> => {
  try {
    const user = await UserModel.findOne({
      where: { id, isValid: true }, // filtra los usuarios activos solamente
    });

    if (!user) {
      throw new Error(MESSAGES.USER_NOT_FOUND);
    }

    const userDTO: UserDTO = {
      longName: user.longName,
      email: user.email,
      about: user.about,
      imageProfile: user.imageProfile,
    };

    return userDTO;
  } catch (error: any) {
    if (error.name === "SequelizeConnectionError") {
      throw new Error(MESSAGES.CONNECTION_ERROR);
    }
    throw new Error(`${MESSAGES.FETCH_ERROR} + ${error.message}`);
  }
};

export const findUserByEmail = async (email: string): Promise<boolean> => {
  try {
    const findedProfile = await UserModel.findOne({where: {email}});
    if (findedProfile) {
      const error: any = new Error(MESSAGES.EMAIL_ALREADY);
      error.status = 400;
      throw error;
    }
    return false;
  } catch (error: any) {
    if (error.name === "SequelizeConnectionError") {
      throw new Error(MESSAGES.CONNECTION_ERROR);
    }
    throw error;
  }
};

export const findMyUser = async (id: string): Promise<UserModel | null> => {
  try {
    const findedProfile = await UserModel.findByPk(id);
    if (!findedProfile) {
      const error: any = new Error(MESSAGES.USER_NOT_FOUND);
      error.status = 404;
      throw error;
    }

    const { password, ...profileWithoutPassword } = findedProfile.toJSON();

    return profileWithoutPassword;
  } catch (error: any) {
    if (error.name === "SequelizeConnectionError") {
      throw new Error(MESSAGES.CONNECTION_ERROR);
    }
    throw error;
  }
};


export const updateUserById = async (
  id: string,
  updateData: Partial<UserDTO>,
  password?: string
): Promise<UserDTO | null> => {
  const transaction: Transaction = await sequelize.transaction();

  try {
    const user = await UserModel.findOne({
      where: { id, isValid: true }, // Solo buscamos usuarios activos
      transaction,
    });

    if (!user) {
      throw new Error(MESSAGES.USER_NOT_FOUND);
    }

    if (password) {
      validatePassword(password);
      user.password = await encryptPassword(password);
    }

    Object.assign(user, updateData);
    await user.save({ transaction });

    await transaction.commit();

    const userDTO: UserDTO = {
      longName: user.longName,
      email: user.email,
      about: user.about,
      imageProfile: user.imageProfile,
    };

    return userDTO;
  } catch (error: any) {
    await transaction.rollback();
    if (error.name === "SequelizeConnectionError") {
      throw new Error(MESSAGES.CONNECTION_ERROR);
    }
    throw new Error(`${MESSAGES.FETCH_ERROR} | ${error.message}`);
  }
};

// desactiva tanto el perfil basico como el pro si tuviera
export const deactivateUserByPk = async (
  id: string
): Promise<UserModel | null> => {
  const transaction: Transaction = await sequelize.transaction();
  try {
    const user = await UserModel.findOne({
      where: { id, isValid: true }, // filtra los usuarios activos solamente
    });

    if (!user) {
      throw new Error(MESSAGES.USER_NOT_FOUND);
    }

    // Busca al usuario pro (si existe)
    const userPro = await UserProModel.findOne({
      where: { userId: id, isValid: true }, // filtra los perfiles pro activos
    });

    if (userPro) {
      userPro.isValid = false;
      await userPro.save({ transaction });
    }

    // Desactiva el perfil básico
    user.isValid = false;
    await user.save({ transaction });

    await transaction.commit();
    return user;
  } catch (error: any) {
    // Revertir la transacción en caso de error
    await transaction.rollback();
    if (error.name === "SequelizeConnectionError") {
      throw new Error(MESSAGES.CONNECTION_ERROR);
    }
    throw new Error(`${MESSAGES.USER_NOT_FOUND} | ${error.message}`);
  }
};

export const changeMembership = async (
  id: string,
  membership: Membership
): Promise<UserDTO> => {
  try {
    const user = await UserModel.findOne({
      where: { id, isValid: true }, // filtra los usuarios activos solamente
    });

    if (!user) {
      throw new Error("El usuario no existe");
    }

    if (!(Object.values(Membership) as string[]).includes(membership)) {
      throw new Error("La membresía proporcionada no es válida");
    }

    if (user.membership === membership) {
      throw new Error("El usuario ya posee esa membresía");
    }

    user.membership = membership;
    await user.save();

    return user as UserDTO;
  } catch (error: any) {
    if (error.name === "SequelizeConnectionError") {
      throw new Error(MESSAGES.CONNECTION_ERROR);
    }
    throw new Error(
      error.message || "Error al cambiar la membresía del usuario"
    );
  }
};

export const getUserMembership = async (
  id: string
): Promise<Membership | null> => {
  try {
    if (!id) {
      const error: any = new Error(MESSAGES.MISSED_DATA);
      error.status = 400; // Código de estado para datos faltantes
      throw error;
    }

    const user = await UserModel.findOne({
      where: { id, isValid: true },
    });

    if (!user) {
      const error: any = new Error(MESSAGES.USER_NOT_FOUND);
      error.status = 404; // Código de estado para "no encontrado"
      throw error;
    }

    if (!user.membership) {
      null; // El usuario no tiene membresía asignada
    }

    return user.membership as Membership;
  } catch (error: any) {
    if (error.name === "SequelizeConnectionError") {
      const dbError: any = new Error(MESSAGES.CONNECTION_ERROR);
      dbError.status = 500; // Error de conexión
      throw dbError;
    }
    const generalError: any = new Error(error.message || MESSAGES.FETCH_ERROR);
    generalError.status = 500; // Error genérico de servidor
    throw generalError;
  }
};
