"use client";

import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
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

const DELETE_STUDENT = gql`
  mutation DeleteStudent($id: ID!) {
    deleteStudent(id: $id)
  }
`;

const StudentDetailPage = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { data, loading } = useQuery<{ student: Student }>(STUDENT_QUERY, { variables: { id } });
  const [deleteStudent] = useMutation(DELETE_STUDENT, { onCompleted: () => router.push("/") });

  const handleDelete = (): void => {
    if (confirm("Are you sure you want to delete this student?")) {
      deleteStudent({ variables: { id } });
    }
  };

  const getGpaColor = (gpa: number): string => {
    if (gpa >= 4.5) return "bg-green-500";
    if (gpa >= 3.5) return "bg-yellow-400";
    if (gpa >= 2.5) return "bg-orange-500";
    return "bg-red-500";
  };

  const getGpaLabel = (gpa: number): string => {
    if (gpa >= 4.5) return "Excellent";
    if (gpa >= 3.5) return "Very Good";
    if (gpa >= 2.5) return "Good";
    return "Needs Improvement";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-400"></div>
      </div>
    );
  }

  if (!data?.student) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">Student not found</p>
          <Link href="/" className="text-green-400 hover:text-green-300 underline">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const student = data.student;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Student Details
            </h1>
            <Link href="/" className="text-gray-400 hover:text-gray-200 transition-colors">
              ← Back
            </Link>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
              <label className="text-gray-400 text-sm font-medium block mb-2">Full Name</label>
              <p className="text-2xl font-semibold">{student.firstName} {student.lastName}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                <label className="text-gray-400 text-sm font-medium block mb-2">Matric Number</label>
                <p className="text-lg text-gray-100 font-mono">{student.matricNo || "—"}</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                <label className="text-gray-400 text-sm font-medium block mb-2">Email</label>
                <p className="text-lg text-gray-100 break-all">{student.email || "—"}</p>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
              <label className="text-gray-400 text-sm font-medium block mb-2">Department</label>
              <p className="text-lg font-semibold">{student.department?.name || "—"}</p>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
              <label className="text-gray-400 text-sm font-medium block mb-2">GPA</label>
              <div className="flex items-center gap-4">
                <span className={`${getGpaColor(student.gpa)} px-4 py-2 rounded-full font-bold text-black text-xl`}>
                  {student.gpa.toFixed(2)}
                </span>
                <span className="text-gray-300 font-medium">{getGpaLabel(student.gpa)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <Link
              href={`/student/${id}/edit`}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-lg text-center font-medium transition-all duration-200 hover:scale-105 shadow-lg shadow-blue-500/20"
            >
              ✏️ Edit
            </Link>
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white text-center py-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg shadow-red-500/20"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailPage;
