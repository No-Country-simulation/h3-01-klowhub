import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { generateShortID } from '../utils/generateShortID';


class LessonModel extends Model {
  public id!: string;
  public courseModuleId!: string;
  public title!: string;
  public description!: string;
  public lessonLink!: string;
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
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lessonLink: {
      type: DataTypes.STRING,
      allowNull: false,
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
