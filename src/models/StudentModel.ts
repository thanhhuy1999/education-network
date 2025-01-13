import { Model, Sequelize } from "sequelize";
import { Optional } from "sequelize/types";

interface StudentAttributes {
    id: number;
    email: string;
    isSuspended: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

interface StudentCreationAttributes
    extends Optional<StudentAttributes, "id" | "createdAt" | "updatedAt"> { }

export class Student
    extends Model<StudentAttributes, StudentCreationAttributes>
    implements StudentAttributes {
    public id!: number;
    public email!: string;
    public isSuspended!: boolean;

    public static associate(models: any) {
        Student.belongsToMany(models.Teacher, {
            through: models.TeacherStudent,
            foreignKey: "studentId",
            onDelete: "CASCADE",
        });
    }
}

export default (sequelize: Sequelize, DataTypes: any) => {
    Student.init(
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
            isSuspended: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                field: "is_suspended",
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
            tableName: "student",
            modelName: "Student",
            timestamps: false,
        },
    );

    return Student;
};
