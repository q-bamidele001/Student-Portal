"use client";

import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Department } from "@/types";
import { motion } from "framer-motion";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { ImageUpload } from "@/components/ImageUpload";

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
      profilePicture
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
  profilePicture: string | null;
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
    profilePicture: null,
  });
  const [error, setError] = useState<string>("");
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const { data: depData, loading: depLoading } = useQuery<{ departments: Department[] }>(
    GET_DEPARTMENTS
  );

  const [addStudent, { loading }] = useMutation(ADD_STUDENT, {
    onCompleted: () => router.push("/"),
    onError: (err) => setError(err.message),
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (base64: string | null) => {
    setForm({ ...form, profilePicture: base64 });
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
            profilePicture: form.profilePicture || undefined,
          },
        },
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 sm:p-6 transition-colors duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 text-gray-100"
          : "bg-gray-50 text-gray-800"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`w-full max-w-2xl rounded-2xl shadow-xl p-6 sm:p-8 border backdrop-blur-md ${
          theme === "dark"
            ? "bg-gray-900/70 border-gray-800"
            : "bg-white/80 border-gray-200"
        }`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6 sm:mb-8 flex-wrap gap-4">
          <h1
            className={`text-2xl sm:text-3xl font-bold bg-clip-text text-transparent ${
              theme === "dark"
                ? "bg-gradient-to-r from-emerald-400 to-blue-500"
                : "bg-gradient-to-r from-emerald-600 to-blue-700"
            }`}
          >
            ✨ Add New Student
          </h1>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:scale-110 transition-transform"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? (
              <SunIcon className="w-6 h-6 text-yellow-400" />
            ) : (
              <MoonIcon className="w-6 h-6 text-blue-600" />
            )}
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {/* Profile Picture Upload */}
          <ImageUpload
            currentImage={form.profilePicture}
            firstName={form.firstName}
            lastName={form.lastName}
            onImageChange={handleImageChange}
            theme={theme}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <InputField
              label="First Name"
              name="firstName"
              placeholder="John"
              required
              value={form.firstName}
              onChange={handleChange}
              theme={theme}
            />
            <InputField
              label="Last Name"
              name="lastName"
              placeholder="Doe"
              required
              value={form.lastName}
              onChange={handleChange}
              theme={theme}
            />
          </div>

          <InputField
            label="Matric Number"
            name="matricNo"
            placeholder="CS/2024/001"
            value={form.matricNo}
            onChange={handleChange}
            theme={theme}
          />

          <InputField
            label="Email"
            name="email"
            placeholder="john.doe@example.com"
            type="email"
            value={form.email}
            onChange={handleChange}
            theme={theme}
          />

          <InputField
            label="GPA (0–5)"
            name="gpa"
            placeholder="4.50"
            type="number"
            min="0"
            max="5"
            step="0.01"
            required
            value={form.gpa}
            onChange={handleChange}
            theme={theme}
          />

          {/* DEPARTMENT SELECT */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Department <span className="text-red-400">*</span>
            </label>
            <select
              name="departmentId"
              value={form.departmentId}
              onChange={handleChange}
              required
              disabled={depLoading || !depData?.departments.length}
              className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                theme === "dark"
                  ? "border-gray-700 bg-gray-900/70 text-gray-100"
                  : "border-gray-300 bg-white text-gray-800"
              }`}
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`px-4 py-3 rounded-lg text-sm font-medium border ${
                theme === "dark"
                  ? "bg-red-900/30 border-red-800 text-red-400"
                  : "bg-red-100 border-red-300 text-red-700"
              }`}
            >
              {error}
            </motion.div>
          )}

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className={`px-6 py-3 rounded-lg font-medium transition-all hover:scale-105 ${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-100"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 rounded-lg font-medium transition-all hover:scale-105 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed ${
                theme === "dark"
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
            >
              {loading ? "Saving..." : "Save Student"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// REUSABLE INPUT FIELD COMPONENT
const InputField = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  theme,
  ...props
}: any) => (
  <div>
    <label
      className={`block text-sm font-medium mb-2 ${
        theme === "dark" ? "text-gray-300" : "text-gray-700"
      }`}
    >
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 transition-all ${
        theme === "dark"
          ? "border-gray-700 bg-gray-900/70 text-gray-100 placeholder-gray-400"
          : "border-gray-300 bg-white text-gray-800 placeholder-gray-500"
      }`}
      {...props}
    />
  </div>
);

export default AddStudentPage;
