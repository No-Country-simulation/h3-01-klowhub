import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/User.model";
import DeviceSession from "../models/DeviceSession.model";
import { UserDTO } from "../dtos/user.dto";
import { MESSAGES } from "../utils/messages";

export const registerUser = async (
  userData: UserDTO, imageProfile: string
): Promise<UserDTO | null> => {
  try {
    const email = userData.email;
    const existingUser = await UserModel.findOne({ where: { email } });
    if (existingUser) {
      const error: any = new Error(MESSAGES.EMAIL_ALREADY);
      error.statusCode = 400;
      throw error;
    }

    if (!userData.password) {
      const error: any = new Error(MESSAGES.EMAIL_ALREADY);
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = await UserModel.create({
      longName: userData.longName,
      email: userData.email,
      password: hashedPassword,
      imageProfile: imageProfile,
    });

    if (!newUser) {
      const error: any = new Error(MESSAGES.USER_CREATE_ERROR);
      error.statusCode = 500;
      throw error;
    }

    return newUser ? (newUser.toJSON() as UserDTO) : null;
  } catch (error: any) {
    if (error.name === "SequelizeConnectionError") {
      throw new Error(MESSAGES.CONNECTION_ERROR);
    }
    throw error;
  }
};

export const loginUser = async (
  email: string,
  password: string,
  device: string | undefined,
  app: string | undefined,
  country: string | undefined,
  city: string | undefined,
  ipAddress: string | undefined
) => {
  try {
    const userData = await UserModel.findOne({ where: { email } });

    // Verificar si el usuario existe y está activo
    if (!userData) {
      throw new Error("Cuenta no encontrada");
    }
    if (!userData.isValid) {
      throw new Error("Cuenta desactivada");
    }

    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      throw new Error("Credenciales de acceso inválidas");
    }

    const token = jwt.sign({ id: userData.id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    // Solo crea o actualiza la sesión si se proporcionan datos de dispositivo y aplicación
    if (device && app && country) {
      const [session, created] = await DeviceSession.findOrCreate({
        where: { userId: userData.id, device, app },
        defaults: { country, city, ipAddress, isActive: true },
      });

      if (!created) {
        await session.update({ isActive: true, ipAddress });
      }
    }

    // Devolver la información del usuario (sin la contraseña) y el token
    const { password: _, ...userWithoutPassword } = userData.toJSON();

    return { user: userWithoutPassword, token };
  } catch (error: any) {
    throw new Error(error.message || "Error en el login");
  }
};

export const logoutUser = async (
  device: string,
  app: string,
  token: string
) => {
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    if (!decoded.id) {
      throw new Error("El token proveído es inválido");
    }

    if (device && app && decoded.id) {
      // Buscar la sesión activa del usuario
      const session = await DeviceSession.findOne({
        where: { userId: decoded.id, device, app },
      });

      if (session) {
        // Desactivar la sesión
        await session.update({ isActive: false });
      } else {
        throw new Error("No se encuentra la sesión");
      }
    }

    return { message: "Se ha cerrado su sesión con éxito" };
  } catch (error: any) {
    throw new Error("Error cerrando sesión");
  }
};
