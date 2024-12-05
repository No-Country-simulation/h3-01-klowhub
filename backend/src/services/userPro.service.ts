import { UserProDTO } from "../dtos/user.dto";
import { MESSAGES } from "../utils/messages";
import sequelize from "../config/database";
import UserProModel from "../models/UserPro.model";
import { Transaction } from "sequelize";
import { mentorService } from ".";

export const saveUserPro = async (
  userProData: Partial<UserProDTO>,
  id: string
): Promise<Partial<UserProDTO> | null> => {
  const transaction: Transaction = await sequelize.transaction();
  try {
    // Verificar si el usuario ya tiene un perfil pro
    const existingUser = await UserProModel.findOne({
      where: { userId: id, isValid: true },
      transaction,
    });
    if (existingUser) {
      const error: any = new Error(MESSAGES.USER_PRO_ALREADY);
      error.status = 404;
      throw error;
    }

    const newUserPro = await UserProModel.create(userProData, { transaction });

    const newUserProDTO: Partial<UserProDTO> = {
      id: newUserPro.id,
      firstName: newUserPro.firstName,
      lastName: newUserPro.lastName,
      about: newUserPro.about,
      country: newUserPro.country,
      sector: newUserPro.sector,
      sectorsExperience: newUserPro.sectorsExperience,
      tools: newUserPro.tools,
      toolsExperience: newUserPro.toolsExperience,
      portfolioLink: newUserPro.portfolioLink,
      academicFormation: newUserPro.academicFormation,
      certificationLink: newUserPro.certificationLink,
      paymentMethod: newUserPro.paymentMethod,
      imageProfile: newUserPro.imageProfile,
    }

    await transaction.commit();
    return newUserProDTO;
  } catch (error: any) {
    await transaction.rollback(); // Revertir cambios en caso de error
    if (error.name === "SequelizeConnectionError") {
      throw new Error(MESSAGES.CONNECTION_ERROR);
    }
    throw error;
  }
};

export const getUserProById = async (id: string): Promise<UserProDTO | null> =>{
  try {
    const foundedUserPro = await UserProModel.findByPk(id)

  if(!foundedUserPro){
    const error: any = new Error(MESSAGES.USER_PRO_NOEXIST)
    error.statusCode = 404
    throw error
  }

  const userProId = foundedUserPro.id

  const mentor = await mentorService.getMentor(userProId)

  const userPro: UserProDTO = {
    firstName: foundedUserPro.firstName,
    lastName: foundedUserPro.lastName,
    about: foundedUserPro.about,
    country: foundedUserPro.country,
    sector: foundedUserPro.sector,
    certificationLink: foundedUserPro.certificationLink,
    academicFormation: foundedUserPro.academicFormation,
    tools: foundedUserPro.tools,
    paymentMethod: foundedUserPro.paymentMethod,
    portfolioLink: foundedUserPro.portfolioLink,
    accountData: foundedUserPro.accountData,
    imageProfile: foundedUserPro.imageProfile,
    sectorsExperience: foundedUserPro.sectorsExperience,
    toolsExperience: foundedUserPro.toolsExperience,
    mentor: mentor
  }

  return userPro
  } catch (error: any) {
    if(error.name === "SequelizeConnectionError"){
      throw new Error(MESSAGES.CONNECTION_ERROR)
    }
    throw error
  }

}


export const getMyUserProById = async (
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
  userId: string,
  userData: Partial<UserProDTO>
): Promise<UserProDTO | undefined> => {
  try {
    const existingUser = await UserProModel.findOne({
      where: { userId: userId, isValid: true },
    });

    if (!existingUser) {
      const existError: any = new Error(MESSAGES.USER_NOT_FOUND);
      existError.status = 404;
      throw existError;
    }

    const id = existingUser.id

    const [rowsAffected] = await UserProModel.update(userData, {
      where: { id },
    });

    if (rowsAffected === 0) {
      const error: any = new Error(MESSAGES.UPDATE_ERROR);
      error.status = 204;
      throw error;
    }

    const updatedUserPro = await UserProModel.findByPk(id);
    return updatedUserPro ? (updatedUserPro.toJSON() as UserProDTO) : undefined;

  } catch (error: any) {
    if (error.name === "SequelizeConnectionError") {
      throw new Error(MESSAGES.CONNECTION_ERROR);
    }
    throw error;
  }
};