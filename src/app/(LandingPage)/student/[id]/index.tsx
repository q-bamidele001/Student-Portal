"use client";

import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Student } from "@/types";
import { Avatar } from "@/components/Avatar";

const STUDENT_QUERY = gql`
  query GetStudent($id: ID!) {
    student(id: $id) {
      id
      firstName
      lastName
      matricNo
      email
      gpa
      profilePicture
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
  const [deleteStudent] = useMutation(DELETE_STUDENT, {
    onCompleted: () => router.push("/"),
    onError: (err) => alert(`Error deleting student: ${err.message}`),
  });

  const handleDelete = async (): Promise<void> => {
    if (confirm("Are you sure you want to delete this student?")) {
      await deleteStudent({ variables: { id } });
    }
  };

  const getGpaColor = (gpa: number) => {
    if (gpa >= 4.5) return "bg-green-500 text-white";
    if (gpa >= 3.5) return "bg-yellow-400 text-black";
    if (gpa >= 2.5) return "bg-orange-500 text-white";
    return "bg-red-500 text-white";
  };

  const getGpaLabel = (gpa: number) => {
    if (gpa >= 4.5) return "Excellent";
    if (gpa >= 3.5) return "Very Good";
    if (gpa >= 2.5) return "Good";
    return "Needs Improvement";
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-400"></div>
      </div>
    );

  if (!data?.student)
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

  const student = data.student;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen p-4 sm:p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-700"
        >
          {/* HEADER */}
          <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Student Details
            </h1>
            <Link href="/" className="text-gray-400 hover:text-gray-200 transition-colors">
              ← Back
            </Link>
          </div>

          {/* Profile Picture */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <Avatar src={student.profilePicture} firstName={student.firstName} lastName={student.lastName} size="xl" theme="dark" />
          </div>

          {/* Student Info */}
          <div className="space-y-4 sm:space-y-6">
            <InfoCard label="Full Name" value={`${student.firstName} ${student.lastName}`} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard label="Matric Number" value={student.matricNo || "—"} />
              <InfoCard label="Email" value={student.email || "—"} />
            </div>
            <InfoCard label="Department" value={student.department?.name || "—"} />
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
              <label className="text-gray-400 text-sm font-medium block mb-2">GPA</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <span className={`${getGpaColor(student.gpa)} px-4 py-2 rounded-full font-bold text-lg sm:text-xl`}>
                  {student.gpa.toFixed(2)}
                </span>
                <span className="text-gray-300 font-medium">{getGpaLabel(student.gpa)}</span>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Link
              href={`/student/${id}/edit`}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 sm:py-4 rounded-lg text-center font-medium transition-all duration-200 hover:scale-105 shadow-lg shadow-blue-500/20"
            >
              ✏️ Edit
            </Link>
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 sm:py-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg shadow-red-500/20"
            >
              🗑️ Delete
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// REUSABLE INFO CARD COMPONENT
const InfoCard = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-gray-900 rounded-lg p-4 sm:p-6 border border-gray-700">
    <label className="text-gray-400 text-sm font-medium block mb-1">{label}</label>
    <p className="text-lg sm:text-xl font-semibold break-words">{value}</p>
  </div>
);

export default StudentDetailPage;
