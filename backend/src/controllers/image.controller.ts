import { Request, Response } from "express";
import { imageService, userProService } from "../services";
import { MESSAGES } from "../utils/messages";
import { UserProDTO } from "../dtos/user.dto";

export const imageRegisterUserPro = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        message: MESSAGES.ID_MISSING,
      });
      return;
    }
    if (!req.file) {
      res.status(400).json({
        message: MESSAGES.FILE_MISSING,
      });
      return;
    }

    const { path: localFilePath, filename } = req.file;

    // Subir la imagen a Cloudinary
    const { url, publicId } = await imageService.uploadToCloudinary(
      localFilePath,
      filename
    );

    if (!url || !publicId) {
      res.status(500).json({
        message: MESSAGES.IMAGE_UPDATED_ERROR,
      });
      return;
    }

    // Crear objeto para actualizar datos
    const userProData: Partial<UserProDTO> = {
      imageProfile: url,
    };

    const updatedUserPro = await userProService.updateUserPro(id, userProData);
    res.status(200).json({
      message: MESSAGES.UPDATE_SUCCESS,
      data: updatedUserPro,
    });
  } catch (error: any) {
    if (res.headersSent) {
      console.error("Error en updateUserPro: ", MESSAGES.HEADERS_SENT);
      return;
    }

    const statusCode = error.status || 500;
    const message = error.message || MESSAGES.FETCH_ERROR;

    res.status(statusCode).json({ message });
  }
};
