import { Model, Sequelize, Optional } from "sequelize";

interface TeacherStudentAttributes {
    teacherId: number;
    studentId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

interface TeacherStudentCreationAttributes
    extends Optional<TeacherStudentAttributes, "createdAt" | "updatedAt"> { }

export class TeacherStudent
    extends Model<TeacherStudentAttributes, TeacherStudentCreationAttributes>
    implements TeacherStudentAttributes {
    public teacherId!: number;
    public studentId!: number;

    public static associate(models: any) {
        TeacherStudent.belongsTo(models.Teacher, { foreignKey: "teacherId" });
        TeacherStudent.belongsTo(models.Student, { foreignKey: "studentId" });
    }
}

export default (sequelize: Sequelize, DataTypes: any) => {
    TeacherStudent.init(
        {
            teacherId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                references: {
                    model: "Teacher",
                    key: "id",
                },
                allowNull: false,
                field: "teacher_id"
            },
            studentId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                references: {
                    model: "Student",
                    key: "id",
                },
                allowNull: false,
                field: "student_id"
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
            tableName: "teacher-student",
            modelName: "TeacherStudent",
            timestamps: false,
        },
    );

    return TeacherStudent;
};
