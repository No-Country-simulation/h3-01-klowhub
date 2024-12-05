import { Request, Response } from "express";
import { userService } from "../services";
import { MESSAGES } from "../utils/messages";
import { Membership } from "../models/enum/enum";

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      res.status(401).json({ message: MESSAGES.UNAUTHENTICATED });
    }

    const authenticatedUserId = (req.user as { id: string }).id;

    // Verificar si el ID del usuario autenticado coincide con el ID en la URL
    if (id !== authenticatedUserId) {
      res.status(403).json({ message: MESSAGES.FORBIDDEN });
    }

    const { password, ...updateData } = req.body;

    const { email } = updateData;

    await userService.findUserByEmail(email);

    const updatedUser = await userService.updateUserById(
      id,
      updateData,
      password
    );

    res.status(200).json({
      user: updatedUser,
      message: MESSAGES.UPDATE_SUCCESS,
    });
  } catch (error: any) {
    if (res.headersSent) {
      console.error("Error en updateUser: ", MESSAGES.HEADERS_SENT);
      return; // Si los encabezados ya se enviaron, no hacer nada más
    }
    console.error(MESSAGES.UPDATE_ERROR, error.message);
    res
      .status(error.message === MESSAGES.USER_NOT_FOUND ? 404 : 500)
      .json({ message: error.message });
  }
};

export const getMyUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!req.user) {
      res.status(401).json({ message: MESSAGES.UNAUTHENTICATED });
    }

    const authenticatedUserId = (req.user as { id: string }).id;

    // Verificar si el ID del usuario autenticado coincide con el ID en la URL
    if (id !== authenticatedUserId) {
      res.status(403).json({ message: MESSAGES.FORBIDDEN });
    }

    const existingUser = await userService.findMyUser(id);
    if (!existingUser) {
      res.status(404).json({
        message: MESSAGES.USER_NOT_FOUND,
      });
      return;
    }

    // Devolvemos la respuesta correctamente
    res.status(200).json({
      message: "Usuario encontrado",
      data: existingUser,
    });
  } catch (error: any) {
    if (res.headersSent) {
      console.error("Error en getUserMembership: ", MESSAGES.HEADERS_SENT);
      return;
    }

    console.error("Error en getUserMembership:", error);

    // Utilizamos el status del error lanzado por el servicio
    const statusCode = error.status || 500;
    const message = error.message || MESSAGES.FETCH_ERROR;

    res.status(statusCode).json({ message });
  }
};

//Llamar a un usuario por id
export const getOneUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await userService.findUserDTOByPk(id);
    if (!user) {
      res.status(404).json({ message: MESSAGES.USER_NOT_FOUND });
      return;
    }

    res.status(200).json({ user, message: MESSAGES.FETCH_SUCCESS });
  } catch (error: any) {
    if (res.headersSent) {
      console.error("Error en getOneUser: ", MESSAGES.HEADERS_SENT);
      return; // Si los encabezados ya se enviaron, no hacer nada más
    }
    console.error(MESSAGES.FETCH_ERROR, error.message);
    res.status(404).json({ message: MESSAGES.FETCH_ERROR + error.message });
  }
};

//Desactivar la cuenta del usuario
export const deactivateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      res.status(401).json({ message: MESSAGES.UNAUTHENTICATED });
    }

    const authenticatedUserId = (req.user as { id: string }).id;

    // Verificar si el ID del usuario autenticado coincide con el ID en la URL
    if (id !== authenticatedUserId) {
      res.status(403).json({ message: MESSAGES.FORBIDDEN });
    }

    const deactivatedUser = await userService.deactivateUserByPk(id);

    res.status(200).json({
      message: MESSAGES.ELIMINATE_SUCCESS,
      user: deactivatedUser,
    });
  } catch (error: any) {
    if (res.headersSent) {
      console.error("Error en deactivateUser: ", MESSAGES.HEADERS_SENT);
      return;
    }
    console.error(MESSAGES.ELIMINATE_ERROR, error.message);
    res
      .status(error.message === MESSAGES.USER_NOT_FOUND ? 404 : 500)
      .json({ message: error.message });
  }
};

export const changeMembership = async (req: Request, res: Response) => {
  try {
    const { membership } = req.body;
    const { id } = req.params;

    if (!membership || !id) {
      res.status(400).json({
        message: MESSAGES.MISSED_DATA,
      });
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: MESSAGES.UNAUTHENTICATED });
    }

    const authenticatedUserId = (req.user as { id: string }).id;

    // Verificar si el ID del usuario autenticado coincide con el ID en la URL
    if (id !== authenticatedUserId) {
      res.status(403).json({ message: MESSAGES.FORBIDDEN });
    }

    const updatedUser = await userService.changeMembership(id, membership);

    if(!updatedUser){
      res.status(500).json({
        message: MESSAGES.UPDATE_ERROR
      })
      return
    }

    res.status(200).json({
      message: MESSAGES.UPDATE_SUCCESS,
    });
  } catch (error: any) {
    if (res.headersSent) {
      console.error("Error en changeMembership: ", MESSAGES.HEADERS_SENT);
      return;
    }

    // Manejo de errores conocido
    console.error("Error en changeMembership:", error);
    if (error.message === "El usuario no existe") {
      res.status(404).json({ message: MESSAGES.USER_NOT_FOUND });
    } else if (error.message === "La membresía proporcionada no es válida") {
      res.status(400).json({ message: MESSAGES.MEMBERSHIP_INVALID });
    } else if (error.message === "El usuario ya posee esa membresía") {
      res.status(409).json({ message: MESSAGES.MEMBERSHIP_ALREADY }); // Error de conflicto
    } else {
      // Error genérico
      res.status(500).json({
        message: MESSAGES.UPDATE_ERROR,
      });
    }
  }
};

export const getUserMembership = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: MESSAGES.MISSED_DATA });
    }

    const userMembership: Membership | null =
      await userService.getUserMembership(id);

    if (userMembership === null) {
      res.status(204).json({ message: MESSAGES.MEMBERSHIP_NULL });
    }

    res.status(200).json({
      data: userMembership,
      message: MESSAGES.FETCH_SUCCESS,
    });
  } catch (error: any) {
    if (res.headersSent) {
      console.error("Error en getUserMembership: ", MESSAGES.HEADERS_SENT);
      return;
    }

    console.error("Error en getUserMembership:", error);

    // Utilizamos el status del error lanzado por el servicio
    const statusCode = error.status || 500;
    const message = error.message || MESSAGES.FETCH_ERROR;

    res.status(statusCode).json({ message });
  }
};