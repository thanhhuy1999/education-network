export interface TeacherWithStudents {
    id?: number;
    email?: string;
    Students?: StudentDTO[];
}

export interface StudentDTO {
    id?: number;
    email?: string;
    isSuspended?: boolean;
}

export interface TeacherDTO {
    id?: number;
    email?: string;
}

export interface TeacherStudentRes {
    id?: number;
    teacherId?: number;
    studentId?: number;
    Student?: StudentDTO;
    Teacher?: TeacherDTO;
}