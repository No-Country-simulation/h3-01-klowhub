import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import { generateShortID } from "../utils/generateShortID";


class DeviceSession extends Model {
    public id!: string;
    public userId!: string;
    public app!: string;
    public device!: string;
    public country!: string;
    public city!: string;
    public ipAddress!: string;
    public isActive!: boolean;
}

DeviceSession.init(
    {
        id: {
            type: DataTypes.STRING(10),
            primaryKey: true,
            defaultValue: generateShortID,
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "user_id",
            references: {
              model: "users",  // referenciamos la tabla users
              key: "id",       // pk
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
        app: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        device: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ipAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "ip_address"
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: "is_active"
        },
    },
    {
        sequelize,
        modelName: "DeviceSession",
        tableName: "device_sessions",
        timestamps: true,
        hooks: {
            beforeCreate: (session: DeviceSession) => {
                session.id = generateShortID();
            },
        },
    }
);

export default DeviceSession;