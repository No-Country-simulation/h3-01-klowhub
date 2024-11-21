import { DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { ProductModel } from './ProductModel';
import { Competence } from './interfaces/course.interface';
import { Platform, Sector, Tag } from './interfaces/product.interface';

function generateShortID(): string {
  return (
    Date.now().toString(36).substring(0, 6) +
    Math.random().toString(36).substring(2, 6)
  ).substring(0, 10);
}

class CourseModel extends ProductModel {
  public competence!: Competence;
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
    detail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    aboutLearn: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'about_learn',
    },
    competence: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isIn: [Object.values(Competence)],
      },
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [Object.values(Platform)],
      },
    },
    imageMain: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sector: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [Object.values(Sector)],
      },
    },
    tags: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isIn: [Object.values(Tag)],
      },
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
