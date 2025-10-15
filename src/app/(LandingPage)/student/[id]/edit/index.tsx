"use client";

import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Department, Student } from "@/types";

const STUDENT_QUERY = gql`
  query GetStudent($id: ID!) {
    student(id: $id) {
      id
      firstName
      lastName
      matricNo
      email
      gpa
      department {
        id
        name
      }
    }
  }
`;

const UPDATE_STUDENT = gql`
  mutation UpdateStudent($id: ID!, $input: StudentInput!) {
    updateStudent(id: $id, input: $input) {
      id
      firstName
      lastName
      gpa
      department {
        name
      }
    }
  }
`;

const DEPARTMENTS_QUERY = gql`
  query Departments {
    departments {
      id
      name
    }
  }
`;

interface FormState {
  firstName: string;
  lastName: string;
  matricNo: string;
  email: string;
  gpa: string;
  departmentId: string;
}

const EditStudentPage = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [customError, setCustomError] = useState<string>("");

  const { data: depData } = useQuery<{ departments: Department[] }>(DEPARTMENTS_QUERY);
  const { data, loading } = useQuery<{ student: Student }>(STUDENT_QUERY, { variables: { id } });

  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    matricNo: "",
    email: "",
    gpa: "",
    departmentId: "",
  });

  useEffect(() => {
    if (data?.student) {
      setForm({
        firstName: data.student.firstName,
        lastName: data.student.lastName,
        matricNo: data.student.matricNo || "",
        email: data.student.email || "",
        gpa: data.student.gpa.toString(),
        departmentId: data.student.department?.id || "",
      });
    }
  }, [data]);

  const [updateStudent, { loading: saving }] = useMutation(UPDATE_STUDENT, {
    onCompleted: () => router.push(`/student/${id}`),
    onError: (err) => setCustomError(err.message),
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setCustomError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!form.firstName || !form.lastName || !form.gpa || !form.departmentId) {
      setCustomError("First name, last name, GPA, and department are required");
      return;
    }

    const gpaNum = parseFloat(form.gpa);
    if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 5) {
      setCustomError("GPA must be a number between 0 and 5");
      return;
    }

    await updateStudent({
      variables: {
        id,
        input: {
          firstName: form.firstName,
          lastName: form.lastName,
          matricNo: form.matricNo || undefined,
          email: form.email || undefined,
          gpa: gpaNum,
          departmentId: form.departmentId,
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-2xl bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-gray-700">
        <h1 className="text-center text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          ✏️ Edit Student
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                First Name <span className="text-red-400">*</span>
              </label>
              <input
                name="firstName"
                type="text"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                required
                className="w-full border border-gray-700 rounded-lg px-4 py-3 bg-gray-900 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Last Name <span className="text-red-400">*</span>
              </label>
              <input
                name="lastName"
                type="text"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                required
                className="w-full border border-gray-700 rounded-lg px-4 py-3 bg-gray-900 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Matric Number</label>
            <input
              name="matricNo"
              type="text"
              placeholder="Matric Number"
              value={form.matricNo}
              onChange={handleChange}
              className="w-full border border-gray-700 rounded-lg px-4 py-3 bg-gray-900 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-700 rounded-lg px-4 py-3 bg-gray-900 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              GPA (0-5) <span className="text-red-400">*</span>
            </label>
            <input
              name="gpa"
              type="number"
              step="0.01"
              min="0"
              max="5"
              placeholder="GPA"
              value={form.gpa}
              onChange={handleChange}
              required
              className="w-full border border-gray-700 rounded-lg px-4 py-3 bg-gray-900 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Department <span className="text-red-400">*</span>
            </label>
            <select
              name="departmentId"
              value={form.departmentId}
              onChange={handleChange}
              required
              className="w-full border border-gray-700 rounded-lg px-4 py-3 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            >
              <option value="">Select Department</option>
              {depData?.departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {customError && (
            <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded-lg text-sm font-medium">
              {customError}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-100 transition-all duration-200 hover:scale-105 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/50"
            >
              {saving ? "Updating..." : "Update Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudentPage;
