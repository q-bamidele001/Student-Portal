import dbConnect from "@/lib/mongoose";
import { Department } from "@/models/Department";
import { Student } from "@/models/Student";

export const resolvers = {
  Query: {
    departments: async () => {
      await dbConnect();
      return await Department.find({});
    },
    department: async (_: unknown, { id }: { id: string }) => {
      await dbConnect();
      return await Department.findById(id);
    },
    students: async () => {
      await dbConnect();
      return await Student.find({}).populate("department");
    },
    student: async (_: unknown, { id }: { id: string }) => {
      await dbConnect();
      return await Student.findById(id).populate("department");
    },
  },

  Mutation: {
    addDepartment: async (_: unknown, { input }: { input: { name: string; code?: string } }) => {
      await dbConnect();
      const department = new Department(input);
      return await department.save();
    },
    updateDepartment: async (
      _: unknown,
      { id, input }: { id: string; input: { name: string; code?: string } }
    ) => {
      await dbConnect();
      return await Department.findByIdAndUpdate(id, input, { new: true });
    },
    deleteDepartment: async (_: unknown, { id }: { id: string }) => {
      await dbConnect();
      await Department.findByIdAndDelete(id);
      return true;
    },
    addStudent: async (
      _: unknown,
      {
        input,
      }: {
        input: {
          firstName: string;
          lastName: string;
          matricNo?: string;
          email?: string;
          gpa: number;
          departmentId: string;
          profilePicture?: string;
        };
      }
    ) => {
      await dbConnect();
      const student = new Student({
        firstName: input.firstName,
        lastName: input.lastName,
        matricNo: input.matricNo,
        email: input.email,
        gpa: input.gpa,
        department: input.departmentId,
        profilePicture: input.profilePicture,
      });
      await student.save();
      return await student.populate("department");
    },
    updateStudent: async (
      _: unknown,
      {
        id,
        input,
      }: {
        id: string;
        input: {
          firstName: string;
          lastName: string;
          matricNo?: string;
          email?: string;
          gpa: number;
          departmentId: string;
          profilePicture?: string;
        };
      }
    ) => {
      await dbConnect();
      const updateData: any = {
        firstName: input.firstName,
        lastName: input.lastName,
        matricNo: input.matricNo,
        email: input.email,
        gpa: input.gpa,
        department: input.departmentId,
      };

      // Only update profilePicture if it's provided
      if (input.profilePicture !== undefined) {
        updateData.profilePicture = input.profilePicture;
      }

      const student = await Student.findByIdAndUpdate(id, updateData, {
        new: true,
      }).populate("department");
      return student;
    },
    deleteStudent: async (_: unknown, { id }: { id: string }) => {
      await dbConnect();
      await Student.findByIdAndDelete(id);
      return true;
    },
  },

  Department: {
    students: async (parent: { _id: string }) => {
      await dbConnect();
      return await Student.find({ department: parent._id });
    },
  },
};