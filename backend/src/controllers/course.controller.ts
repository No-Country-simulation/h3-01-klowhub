import { Request, Response } from 'express';
import courseService from '../services/course.service';
import { MESSAGES } from '../utils/messages';

export const createCourse = async (req: Request, res: Response) => {
  try {
    const courseData = req.body;

    if (!courseData || !courseData.course || !courseData.modules) {
      res.status(400).json({
        message: MESSAGES.MISSED_DATA,
      });
      return;
    }

    const newCourse = await courseService.saveCourse(courseData);

    res.status(201).json({
      message: MESSAGES.CREATE_SUCCESS,
      data: newCourse,
    });
  } catch (error) {
    if (res.headersSent) {
      console.error("Error en getUserMembership: ", MESSAGES.HEADERS_SENT);
      return;
    }
    console.error('Error en createCourse:', error);
    res.status(500).json({
      message: MESSAGES.CREATE_ERROR,
      data: null,
    });
  }
};

export const getOneCourse = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.id;
    const courseFounded = await courseService.findCourse(courseId);

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
  } catch (error) {
    if (res.headersSent) {
      console.error("Error en getUserMembership: ", MESSAGES.HEADERS_SENT);
      return;
    }
    console.error('Error en getOneCourse:', error);
    res.status(500).json({
      message: MESSAGES.FETCH_ERROR,
      data: null,
    });
  }
};
