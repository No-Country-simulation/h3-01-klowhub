import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { generateShortID } from '../utils/generateShortID';


class LessonModel extends Model {
  public id!: string;
  public courseModuleId!: string;
  public title!: string;
  public detail!: string;
  public lessonLink!: string;
  public additionalPdf1!: string;
  public additionalPdf2!: string;
}

LessonModel.init(
  {
    id: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      defaultValue: generateShortID,
    },
    courseModuleId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'course_module_id',
      references: {
        model: 'course_modules',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    detail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lessonLink: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    additionalPdf1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    additionalPdf2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Lesson',
    tableName: 'lessons',
    timestamps: true,
    hooks: {
      beforeCreate: (lesson: LessonModel) => {
        lesson.id = generateShortID();
      },
    },
  }
);

export default LessonModel;
