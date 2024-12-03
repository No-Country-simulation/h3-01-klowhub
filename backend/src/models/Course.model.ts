import { DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { ProductModel } from './Product.model';
import { Competence, Platform, Sector, Tag } from './enum/enum';
import { generateShortID } from '../utils/generateShortID';

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
      type: DataTypes.ARRAY(DataTypes.STRING),
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
