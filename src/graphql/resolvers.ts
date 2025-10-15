import { Student } from "@/models/Student";
import { Department } from "@/models/Department";
import dbConnect from "@/lib/mongoose";
import mongoose from "mongoose";

interface StudentInput {
  firstName: string;
  lastName: string;
  matricNo?: string;
  email?: string;
  gpa: number;
  departmentId?: string;
}

interface DepartmentInput {
  name: string;
  code?: string;
}

export const resolvers = {
  Query: {
    students: async (): Promise<any[]> => {
      await dbConnect();
      return Student.find().populate("department");
    },

    student: async (_: any, { id }: { id: string }): Promise<any> => {
      await dbConnect();
      return Student.findById(id).populate("department");
    },

    departments: async (): Promise<any[]> => {
      await dbConnect();
      return Department.find();
    },

    department: async (_: any, { id }: { id: string }): Promise<any> => {
      await dbConnect();
      return Department.findById(id);
    },
  },

  Mutation: {
    addStudent: async (_: any, { input }: { input: StudentInput }): Promise<any> => {
      await dbConnect();

      if (input.matricNo) {
        const existing = await Student.findOne({ matricNo: input.matricNo });
        if (existing) {
          throw new Error(`A student with matric number "${input.matricNo}" already exists.`);
        }
      }

      let departmentId: mongoose.Types.ObjectId | undefined;
      
      if (input.departmentId) {
        if (!mongoose.Types.ObjectId.isValid(input.departmentId)) {
          throw new Error("Invalid department ID");
        }

        const departmentDoc = await Department.findById(input.departmentId);
        if (!departmentDoc) {
          throw new Error("Department not found");
        }

        departmentId = new mongoose.Types.ObjectId(input.departmentId);
      }

      const student = await Student.create({
        firstName: input.firstName,
        lastName: input.lastName,
        matricNo: input.matricNo || undefined,
        email: input.email || undefined,
        gpa: input.gpa,
        department: departmentId,
      });

      return student.populate("department");
    },

    updateStudent: async (_: any, { id, input }: { id: string; input: StudentInput }): Promise<any> => {
      await dbConnect();

      if (input.matricNo) {
        const existing = await Student.findOne({
          matricNo: input.matricNo,
          _id: { $ne: id },
        });
        if (existing) {
          throw new Error(`A student with matric number "${input.matricNo}" already exists.`);
        }
      }

      let departmentId: mongoose.Types.ObjectId | undefined;
      
      if (input.departmentId) {
        if (!mongoose.Types.ObjectId.isValid(input.departmentId)) {
          throw new Error("Invalid department ID");
        }

        const departmentDoc = await Department.findById(input.departmentId);
        if (!departmentDoc) {
          throw new Error("Department not found");
        }

        departmentId = new mongoose.Types.ObjectId(input.departmentId);
      }

      const student = await Student.findByIdAndUpdate(
        id,
        {
          firstName: input.firstName,
          lastName: input.lastName,
          matricNo: input.matricNo || undefined,
          email: input.email || undefined,
          gpa: input.gpa,
          department: departmentId,
        },
        { new: true }
      );

      return student?.populate("department");
    },

    deleteStudent: async (_: any, { id }: { id: string }): Promise<boolean> => {
      await dbConnect();
      const result = await Student.findByIdAndDelete(id);
      return !!result;
    },

    addDepartment: async (_: any, { input }: { input: DepartmentInput }): Promise<any> => {
      await dbConnect();
      
      const existing = await Department.findOne({ name: input.name });
      if (existing) {
        throw new Error(`Department "${input.name}" already exists.`);
      }

      const department = await Department.create({
        name: input.name,
        code: input.code || undefined,
      });

      return department;
    },

    updateDepartment: async (_: any, { id, input }: { id: string; input: DepartmentInput }): Promise<any> => {
      await dbConnect();
      
      const existing = await Department.findOne({
        name: input.name,
        _id: { $ne: id },
      });
      if (existing) {
        throw new Error(`Department "${input.name}" already exists.`);
      }

      const department = await Department.findByIdAndUpdate(
        id,
        {
          name: input.name,
          code: input.code || undefined,
        },
        { new: true }
      );

      if (!department) {
        throw new Error("Department not found");
      }

      return department;
    },

    deleteDepartment: async (_: any, { id }: { id: string }): Promise<boolean> => {
      await dbConnect();

      await Student.updateMany({ department: id }, { $unset: { department: "" } });

      const result = await Department.findByIdAndDelete(id);
      return !!result;
    },
  },
};