import { Transaction } from "sequelize";
import sequelize from "../config/database";
import { CourseModel, CourseModuleModel, LessonModel } from "../models/";
import { MESSAGES } from "../utils/messages";
import { CourseDTO, LessonDataDTO, ModuleDataDTO } from "../dtos/course.dto";

const saveCourse = async (courseData: CourseDTO): Promise<CourseDTO | null> => {
  const transaction: Transaction = await sequelize.transaction();

  try {
    const course = await CourseModel.create(courseData.course, { transaction });

    const modulesWithLessons = [];

    // Crear los módulos y sus lecciones asociadas
    for (const moduleData of courseData.modules) {
      const module = await CourseModuleModel.create(
        {
          ...moduleData,
          courseId: course.id, // Relacionar el módulo con el curso
        },
        { transaction }
      );

      const lessons = [];
      for (const lessonData of moduleData.lessons) {
        const lesson = await LessonModel.create(
          {
            ...lessonData,
            courseModuleId: module.id, // Relacionar la lección con el módulo
          },
          { transaction }
        );
        lessons.push(lesson); // Agregar lección a la lista
      }

      modulesWithLessons.push({ ...module.toJSON(), lessons }); // Relacionar módulo con sus lecciones
    }

    await transaction.commit();

    return {
      course: course.toJSON(),
      modules: modulesWithLessons,
    };
  } catch (error: any) {
    await transaction.rollback();
    if (error.name === "SequelizeConnectionError") {
      throw new Error(MESSAGES.CONNECTION_ERROR);
    }
    throw new Error(`${MESSAGES.CREATE_ERROR} | ${error.message}`);
  }
};

const findCourse = async (courseId: string) => {
  try {
    const course = await CourseModel.findOne({
      where: { id: courseId },
      attributes: [
        "title",
        "detail",
        "aboutLearn",
        "competence",
        "platform",
        "imageMain",
        "sector",
        "tags",
        "price",
      ], // Solo devuelve estos campos del curso
      include: [
        {
          model: CourseModuleModel,
          attributes: ["title", "detail"],
          include: [
            {
              model: LessonModel,
              attributes: [
                'title',
                'detail',
                'lessonLink',
                'additionalPdf1',
                'additionalPdf2',
              ],
            },
          ],
        },
      ],
    });
    return course;
  } catch (error: any) {
    if (error.name === "SequelizeConnectionError") {
      throw new Error(MESSAGES.CONNECTION_ERROR);
    }
    throw new Error(`${MESSAGES.FETCH_ERROR} | ${error.message}`);
  }
};

export default { saveCourse, findCourse };
