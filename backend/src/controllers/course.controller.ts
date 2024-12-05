import { Request, Response } from "express";
import courseService from "../services/course.service";
import { MESSAGES } from "../utils/messages";
import { userProService } from "../services";

export const createCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const courseData = req.body;

    if (!req.user) {
      res.status(401).json({ message: MESSAGES.UNAUTHENTICATED });
    }

    const authenticatedUserId = (req.user as { id: string }).id;

    // Verificar si el ID del usuario autenticado coincide con el ID en la URL
    if (id !== authenticatedUserId) {
      res.status(403).json({ message: MESSAGES.FORBIDDEN });
    }

    if(!id){
      res.status(400).json({
        message: MESSAGES.ID_MISSING
      })
      return
    }

    if (
      !courseData ||
      !courseData.course ||
      !Array.isArray(courseData.modules)
    ) {
      res.status(400).json({
        message: MESSAGES.MISSED_DATA,
      });
      return;
    }

    // comprobar que el usuario tenga un perfil Pro
    await userProService.getMyUserProById(id)

    // Asignar imagen por defecto para el curso
    const DEFAULT_COURSE_IMAGE_URL = `${req.protocol}://${req.get(
      "host"
    )}/static/images/default-course.jpg`;
    courseData.course.imageMain =
      courseData.course.imageMain || DEFAULT_COURSE_IMAGE_URL;

    // Asignar imagen por defecto para las lecciones
    const DEFAULT_LESSON_IMAGE_URL = `${req.protocol}://${req.get(
      "host"
    )}/static/images/default-lesson.jpg`;

    courseData.modules.forEach((module: any) => {
      module.lessons.forEach((lesson: any) => {
        lesson.imageMain = lesson.imageMain || DEFAULT_LESSON_IMAGE_URL;
      });
    });

    // le adherimos el id del user que lo esta creando
    courseData.course.ownerId = id

    const newCourse = await courseService.saveCourse(courseData);

    res.status(201).json({
      message: MESSAGES.CREATE_SUCCESS,
      data: newCourse,
    });
  } catch (error: any) {
    if (res.headersSent) {
      console.error("Error en createCourse: ", MESSAGES.HEADERS_SENT);
      return;
    }

    const statusCode = error.status || 500;
    const message = error.message || MESSAGES.CREATE_ERROR;

    res.status(statusCode).json({ message });
  }
};

export const getOneCourse = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.id;
    const courseFounded = await courseService.findCourse(courseId);

    if (!courseId) {
      res.status(400).json({
        message: MESSAGES.ID_MISSING,
      });
      return;
    }

    if (!courseFounded) {
      res.status(404).json({
        message: MESSAGES.COURSE_NOT_FOUND,
      });
      return;
    }

    res.status(200).json({
      message: MESSAGES.FETCH_SUCCESS,
      data: courseFounded,
    });
  } catch (error: any) {
    if (res.headersSent) {
      console.error("Error en getCourse: ", MESSAGES.HEADERS_SENT);
      return;
    }

    const statusCode = error.status || 500;
    const message = error.message || MESSAGES.FETCH_ERROR;

    res.status(statusCode).json({ message });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const courseData = req.body;

    if (!id) {
      res.status(400).json({
        message: MESSAGES.ID_MISSING,
      });
      return;
    }

    if (!courseData) {
      res.status(400).json({
        message: MESSAGES.MISSED_DATA,
      });
      return;
    }

    const updatedCourse = await courseService.updateCourse(id, courseData);

    if (!updatedCourse) {
      res.status(204).json({
        message: MESSAGES.UPDATE_ERROR,
      });
      return;
    }

    res.status(200).json({
      message: MESSAGES.UPDATE_SUCCESS,
      data: updatedCourse,
    });
  } catch (error: any) {
    if (res.headersSent) {
      console.error("Error en getCourse: ", MESSAGES.HEADERS_SENT);
      return;
    }

    const statusCode = error.status || 500;
    const message = error.message || MESSAGES.UPDATE_ERROR;

    res.status(statusCode).json({ message });
  }
};
