import { Transaction } from "sequelize";
import sequelize from "../config/database";
import { CourseModel, CourseModuleModel, LessonModel } from "../models/";
import { MESSAGES } from "../utils/messages";
import { CourseDTO } from "../dtos/course.dto";

const saveCourse = async (courseData: CourseDTO) => {
  const transaction: Transaction = await sequelize.transaction();

  try {
    const course = await CourseModel.create(courseData.course, { transaction });

    for (const moduleData of courseData.modules) {
      const module = await CourseModuleModel.create(
        {
          ...moduleData,
          courseId: course.id,
        },
        { transaction }
      );

      for (const lessonData of moduleData.lessons) {
        await LessonModel.create(
          {
            ...lessonData,
            courseModuleId: module.id,
          },
          { transaction }
        );
      }
    }

    await transaction.commit();

    return course;
  } catch (error: any) {
    await transaction.rollback();
    if (error.name === "SequelizeConnectionError") {
      throw new Error(MESSAGES.CONNECTION_ERROR);
    }
    throw new Error(`${MESSAGES.FETCH_ERROR} | ${error.message}`);
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

// Crear lógica de GetAll, delete...

export default { saveCourse, findCourse };

