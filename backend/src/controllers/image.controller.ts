import { Request, Response } from "express";
import { imageService, userProService, userService } from "../services";
import { MESSAGES } from "../utils/messages";
import { UserDTO, UserProDTO } from "../dtos/user.dto";
import courseService from "../services/course.service";
import { CourseDTO, LessonDataDTO } from "../dtos/course.dto";

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

    const userPro = await userProService.getMyUserProById(id);

    if (!userPro) {
      res.status(404).json({
        message: MESSAGES.USER_NOT_FOUND,
      });
      return;
    }

    // Crear objeto para actualizar datos
    const userProData: Partial<UserProDTO> = {
      imageProfile: url,
      userId: id,
    };

    const userProId = userPro.id;

    const updatedUserPro = await userProService.updateUserPro(
      userProId!,
      userProData
    );
    res.status(200).json({
      message: MESSAGES.UPDATE_SUCCESS,
      data: updatedUserPro,
    });
  } catch (error: any) {
    if (res.headersSent) {
      console.error("Error en imageRegisterUserPro: ", MESSAGES.HEADERS_SENT);
      return;
    }

    const statusCode = error.status || 500;
    const message = error.message || MESSAGES.UPDATE_ERROR;

    res.status(statusCode).json({ message });
  }
};

export const imageRegisterUser = async (req: Request, res: Response) => {
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

    const user = await userService.findUserDTOByPk(id);

    if (!user) {
      res.status(404).json({
        message: MESSAGES.USER_NOT_FOUND,
      });
      return;
    }

    // Crear objeto para actualizar datos
    const userData: Partial<UserDTO> = {
      imageProfile: url
    };


    const updatedUser = await userService.updateUserById(
      id,
      userData
    );
    res.status(200).json({
      message: MESSAGES.UPDATE_SUCCESS,
      data: updatedUser,
    });
  } catch (error: any) {
    if (res.headersSent) {
      console.error("Error en imageRegisterUser: ", MESSAGES.HEADERS_SENT);
      return;
    }

    const statusCode = error.status || 500;
    const message = error.message || MESSAGES.UPDATE_ERROR;

    res.status(statusCode).json({ message });
  }
};

export const imageRegisterCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      res.status(400).json({
        message: MESSAGES.FILE_MISSING,
      });
      return;
    }

    if (!id) {
      res.status(400).json({
        message: MESSAGES.ID_MISSING,
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

    const courseFound = await courseService.findCourse(id);

    if (!courseFound) {
      res.status(404).json({
        message: MESSAGES.COURSE_NOT_FOUND,
      });
      return;
    }

    const courseData: Partial<CourseDTO> = {
      course: {
        imageMain: url,
      },
    };

    const updatedCourse = await courseService.updateCourse(id, courseData);

    if (!updatedCourse) {
      res.status(204).json({
        message: MESSAGES.UPDATE_ERROR,
      });
      return;
    }

    res.status(200).json({
      message: MESSAGES.IMAGE_UPDATED_SUCCESS,
      data: updatedCourse,
    });
  } catch (error: any) {
    if (res.headersSent) {
      console.error("Error en imageRegisterCourse: ", MESSAGES.HEADERS_SENT);
      return;
    }

    const statusCode = error.status || 500;
    const message = error.message || MESSAGES.IMAGE_UPDATED_ERROR;

    res.status(statusCode).json({ message });
  }
};

export const imageRegisterLesson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      res.status(400).json({
        message: MESSAGES.FILE_MISSING,
      });
      return;
    }

    if (!id) {
      res.status(400).json({
        message: MESSAGES.ID_MISSING,
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

    const courseFound = await courseService.findCourse(id);

    if (!courseFound) {
      res.status(404).json({
        message: MESSAGES.USER_NOT_FOUND,
      });
      return;
    }


    const lessonData: Partial<LessonDataDTO> = {
      imageMain: url
    };

    const updatedLesson = await courseService.updateLesson(id, lessonData);

    if (!updatedLesson) {
      res.status(204).json({
        message: MESSAGES.UPDATE_ERROR,
      });
      return;
    }

    res.status(200).json({
      message: MESSAGES.IMAGE_UPDATED_SUCCESS,
      data: updatedLesson,
    });
  } catch (error: any) {
    if (res.headersSent) {
      console.error("Error en imageRegisterLesson: ", MESSAGES.HEADERS_SENT);
      return;
    }

    const statusCode = error.status || 500;
    const message = error.message || MESSAGES.IMAGE_UPDATED_ERROR;

    res.status(statusCode).json({ message });
  }
};
