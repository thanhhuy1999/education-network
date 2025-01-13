import { Model, Sequelize } from "sequelize";
import { Optional } from "sequelize/types";

interface TeacherAttributes {
    id: number;
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface TeacherCreationAttributes
    extends Optional<TeacherAttributes, "id" | "createdAt" | "updatedAt"> { }

export class Teacher
    extends Model<TeacherAttributes, TeacherCreationAttributes>
    implements TeacherAttributes {
    public id!: number;
    public email!: string;

    public static associate(models: any) {
        Teacher.belongsToMany(models.Student, {
            through: models.TeacherStudent,
            foreignKey: "teacherId",
            onDelete: "CASCADE",
        });
    }
}

export default (sequelize: Sequelize, DataTypes: any) => {
    Teacher.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                unique: true,
                primaryKey: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                unique: false,
                field: "created_at",
                defaultValue: Sequelize.fn("NOW"),
            },
            updatedAt: {
                type: DataTypes.DATE,
                field: "updated_at",
                allowNull: false,
                unique: false,
                defaultValue: Sequelize.fn("NOW"),
            },
        },
        {
            sequelize,
            tableName: "teacher",
            modelName: "Teacher",
            timestamps: false,
        },
    );

    return Teacher;
};
