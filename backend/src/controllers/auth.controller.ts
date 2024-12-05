import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { registerUser, loginUser, logoutUser } from '../services/auth.service';
import { MESSAGES } from '../utils/messages';
import { UserDTO } from '../dtos/user.dto';
dotenv.config();

export const register = async (req: Request, res: Response) => {
  try {
    const userData = req.body;

    // Asignar imagen de perfil por default desde la carpeta 'public/images'
    const DEFAULT_IMAGE_URL = `${req.protocol}://${req.get("host")}/static/images/default-profile.jpg`;
    const imageProfile = DEFAULT_IMAGE_URL;

    const newUser = await registerUser(userData, imageProfile);

    if(!newUser){
      res.status(500).json({
        message: MESSAGES.USER_CREATE_ERROR
      })
      return
    }

    const newUserDto: UserDTO = {
      id: newUser.id,
      longName: newUser.longName,
      email: newUser.email,
      imageProfile: newUser.imageProfile,
    }

    res.status(201).json({
      message: MESSAGES.USER_CREATE_SUCCESS,
      data: newUserDto
    });
  } catch (error: any) {
    if (res.headersSent) {
      console.error("Error en registerUser: ", MESSAGES.HEADERS_SENT);
      return;
    }
    const statusCode = error.status || 500;
    const message = error.message || MESSAGES.USER_CREATE_ERROR;
    
    res.status(statusCode).json({ message });
    }
  };

//Controlador de inicio de sesión y añadiendo dispositivo de donde se inicio
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, device, app, country, city, ipAddress } = req.body;

    const { user, token } = await loginUser(
      email,
      password,
      device,
      app,
      country,
      city,
      ipAddress
    );

    res.status(200).json({ token });
  } catch (error: any) {
    if (res.headersSent) {
      console.error("Error en getUserMembership: ", MESSAGES.HEADERS_SENT);
      return;
    }
    
    // Manejo de errores
    if (error.message === 'Cuenta desactivada') {
      res.status(403).json({ message: MESSAGES.UNNACTIVE_USER }); // Código 403 para cuenta desactivada
    } else if (error.message === 'Credenciales de acceso inválidas') {
      res.status(401).json({ message: MESSAGES.BAD_CREDENTIALS }); // Código 401 para credenciales incorrectas
    } else if (error.message === 'Cuenta no encontrada') {
      res.status(404).json({ message: MESSAGES.USER_NOT_FOUND }); // Código 404 para cuenta inexistente
    } else {
      res.status(500).json({ message: MESSAGES.LOGIN_ERROR });
    }
  }
};


//Cierra la sesion del usuario y actualiza que el despositivo esta en cuenta cerrada
export const logout = async (req: Request, res: Response) => {
  try {
    const { device, app } = req.body;
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      res.status(400).json({ message: 'No fue proveído un token válido' });
      return; // rompe el flujo
    }

    const result = await logoutUser(device, app, token);

    res.status(200).json({
      result,
    });
  } catch (error: any) {
    if (res.headersSent) {
      console.error("Error en getUserMembership: ", MESSAGES.HEADERS_SENT);
      return;
    }
    res.status(500).json({ message: error.message || MESSAGES.LOGOUT_ERROR });
  }
};
