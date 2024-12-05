import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import { PaymentMethod, Sector, Tool } from "./enum/enum";
import { generateShortID } from "../utils/generateShortID";

class UserProModel extends Model {
  public id!: string;
  public firstName!: string;
  public lastName!: string;
  public about!: string;
  public country!: string;
  public sector!: Sector[];
  public sectorsExperience!: string;
  public tools!: Tool[];
  public toolsExperience!: string;
  public portfolioLink!: string;
  public academicFormation!: string;
  public certificationLink!: string;
  public paymentMethod!: PaymentMethod;
  public accountData!: string;
  public imageProfile!: string;
  public isValid!: boolean; // perfil activo/inactivo
  public userId!: string; // id de su perfil de usuario básico (User.model.ts)
}

UserProModel.init(
  {
    id: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      defaultValue: generateShortID,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "first_name",
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "last_name",
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sector: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    sectorsExperience: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "sectors_experience",
    },
    tools: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    toolsExperience: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "tools_experience",
    },
    portfolioLink: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "portfolio_link",
    },
    academicFormation: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "academic_formation",
    },
    certificationLink: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "certification_link",
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "payment_method",
    },
    accountData: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "account_data",
    },
    imageProfile: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "image_profile",
    },
    isValid: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "is_valid",
    },
    userId: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: "user_id",
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "UserPro",
    tableName: "users_pro",
    timestamps: true,
    hooks: {
      beforeCreate: (user: UserProModel) => {
        user.id = generateShortID();
      },
    },
  }
);

export default UserProModel;
