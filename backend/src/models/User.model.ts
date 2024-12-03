import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import { generateShortID } from "../utils/generateShortID";
import { Membership } from "./enum/enum";

class UserModel extends Model {
  public id!: string;
  public longName!: string;
  public email!: string;
  public password!: string;
  public role!: string;
  public membership!: Membership | null
  public isValid!: boolean;
  public isVendor!: boolean // por defecto es false hasta que se registra como vendedor
  public googleId!: string
}

UserModel.init(
  {
    id: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      defaultValue: generateShortID,
    },
    longName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "long_name",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user",
    },
    membership: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
      validate: {
        isIn: [Object.values(Membership) || null],
      },
    },
    isValid: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "is_valid",
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true, // Permitimos que sea nulo para usuarios registrados con email/password
      unique: true,
    },    
    isVendor: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_vendor",
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    hooks: {
      beforeCreate: (user: UserModel) => {
        user.id = generateShortID();
      },
    },
  }
);

export default UserModel;
