import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import { Membership, PaymentMethod, Sector, Tool } from "./enum/enum";

function generateShortID(): string {
  return (
    Date.now().toString(36).substring(0, 6) +
    Math.random().toString(36).substring(2, 6)
  ).substring(0, 10);
}

class UserProModel extends Model {
  public id!: string;
  public firstName!: string;
  public lastName!: string;
  public password!: string;
  public description!: string;
  public country!: string;
  public sector!: Sector[];
  public sectorsExperience!: string;
  public tools!: Tool[];
  public toolsExperience!: string;
  public portfolioLink!: string;
  public academicFormation!: string;
  public certificactionLink!: string;
  public certificationFile!: string[];
  public PaymentMethod!: PaymentMethod;
  public accountData!: string;
  public imageProfile!: Buffer | null; // esto es la imagen BLOB para la db
  public membership!: Membership;
  public isValid!: boolean;
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
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
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
      validate: {
        isIn: [Object.values(Sector)],
      },
    },
    sectorsExperience: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "sectors_experience",
    },
    tools: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      validate: {
        isIn: [Object.values(Tool)],
      },
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
    certificactionLink: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "certification_link",
    },
    certificationFile: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      field: "certification_file",
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "payment_method",
      validate: {
        isIn: [Object.values(PaymentMethod)],
      },
    },
    accountData: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "account_data",
    },
    imageProfile: {
      type: DataTypes.BLOB,
      allowNull: true,
      field: "image_profile",
    },
    membership: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [Object.values(Membership)],
      },
    },
    isValid: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "is_valid",
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
