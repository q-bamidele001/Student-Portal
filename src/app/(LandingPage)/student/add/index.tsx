// src/app/(LandingPage)/student/add/page.tsx
"use client";

import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { useState, FormEvent, ChangeEvent } from "react";
import { Department } from "@/types";

const GET_DEPARTMENTS = gql`
  query Departments {
    departments {
      id
      name
    }
  }
`;

const ADD_STUDENT = gql`
  mutation AddStudent($input: StudentInput!) {
    addStudent(input: $input) {
      id
      firstName
      lastName
      gpa
      department {
        id
        name
      }
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

const AddStudentPage = () => {
    const router = useRouter();
    const [form, setForm] = useState<FormState>({
        firstName: "",
        lastName: "",
        matricNo: "",
        email: "",
        gpa: "",
        departmentId: "",
    });
    const [error, setError] = useState<string>("");

    const { data: depData, loading: depLoading } = useQuery<{ departments: Department[] }>(
        GET_DEPARTMENTS
    );

    const [addStudent, { loading }] = useMutation(ADD_STUDENT, {
        onCompleted: () => router.push("/"),
        onError: (err) => setError(err.message),
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (!form.firstName || !form.lastName || !form.gpa || !form.departmentId) {
            setError("First name, last name, GPA, and department are required");
            return;
        }

        const gpaNum = parseFloat(form.gpa);
        if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 5) {
            setError("GPA must be a number between 0 and 5");
            return;
        }

        setError("");

        try {
            await addStudent({
                variables: {
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
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="w-full max-w-2xl bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-gray-700">
                <h1 className="text-center text-3xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                    ✨ Add New Student
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
                                placeholder="John"
                                value={form.firstName}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-700 rounded-lg px-4 py-3 bg-gray-900 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Last Name <span className="text-red-400">*</span>
                            </label>
                            <input
                                name="lastName"
                                type="text"
                                placeholder="Doe"
                                value={form.lastName}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-700 rounded-lg px-4 py-3 bg-gray-900 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Matric Number</label>
                        <input
                            name="matricNo"
                            type="text"
                            placeholder="CS/2024/001"
                            value={form.matricNo}
                            onChange={handleChange}
                            className="w-full border border-gray-700 rounded-lg px-4 py-3 bg-gray-900 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="john.doe@example.com"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full border border-gray-700 rounded-lg px-4 py-3 bg-gray-900 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
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
                            placeholder="4.50"
                            value={form.gpa}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-700 rounded-lg px-4 py-3 bg-gray-900 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
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
                            disabled={depLoading || !depData?.departments.length}
                            className="w-full border border-gray-700 rounded-lg px-4 py-3 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="">Select Department</option>
                            {depData?.departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {error && (
                        <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded-lg text-sm font-medium">
                            {error}
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
                            disabled={loading}
                            className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/50"
                        >
                            {loading ? "Saving..." : "Save Student"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStudentPage;
