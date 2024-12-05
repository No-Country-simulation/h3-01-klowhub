import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { generateShortID } from '../utils/generateShortID';
import { Expertise, Language, Platform, Sector } from './enum/enum';

class MentorModel extends Model {
  public id!: string;
  public userProId!: string;
  public expertiseArea!: Sector[];
  public expertiseLevel!: Expertise;
  public platform!: Platform;
  public mentoryCost!: number;
  public aboutMentories!: string;
  public language!: Language[];
}

MentorModel.init(
  {
    id: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      defaultValue: generateShortID,
    },
    userProId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "user_pro_id",
      references: {
        model: 'users_pro',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    expertiseArea: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      field: "expertise_area",
    },
    expertiseLevel: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "expertise_level",
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mentoryCost: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: "mentory_cost",
    },
    aboutMentories: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "about_mentories",
    },
    language: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Mentor',
    tableName: 'mentors',
    timestamps: true,
    hooks: {
      beforeCreate: (mentor: MentorModel) => {
        mentor.id = generateShortID();
      },
    },
  }
);

export default MentorModel;
