import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import { generateShortID } from "../utils/generateShortID";

class CourseModuleModel extends Model {
  public id!: string;
  public courseId!: string;
  public title!: string;
  public description!: string;
}

CourseModuleModel.init(
  {
    id: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      defaultValue: generateShortID,
    },
    courseId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "course_id",
      references: {
        model: "courses",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "CourseModule",
    tableName: "course_modules",
    timestamps: true,
    hooks: {
      beforeCreate: (module: CourseModuleModel) => {
        module.id = generateShortID();
      },
    },
  }
);

export default CourseModuleModel;
