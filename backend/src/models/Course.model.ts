import { DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { ProductModel } from './Product.model';
import { Competence, Language, Tool } from './enum/enum';
import { generateShortID } from '../utils/generateShortID';

class CourseModel extends ProductModel {
  public competence!: Competence;
  public tools!: Tool[]
  public languages!: Language[]
}

CourseModel.init(
  {
    id: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      defaultValue: generateShortID,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    aboutLearn: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'about_learn',
    },
    competence: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageMain: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sector: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    tools: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    languages: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    ownerId: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'owner_id',
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    modelName: 'Course',
    tableName: 'courses',
    timestamps: true,
    hooks: {
      beforeCreate: (course: CourseModel) => {
        course.id = generateShortID();
      },
    },
  }
);

export default CourseModel;
