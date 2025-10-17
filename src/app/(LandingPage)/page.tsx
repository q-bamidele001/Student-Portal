"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { useEffect, useState, useMemo, ChangeEvent } from "react";
import { Listbox } from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  MoonIcon,
  SunIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import { Department, Student } from "@/types";
import { useSession, signOut } from "next-auth/react";
import { Avatar } from "@/components/Avatar";

const STUDENTS_QUERY = gql`
  query Students {
    students {
      id
      firstName
      lastName
      email
      matricNo
      gpa
      profilePicture
      department {
        id
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

const DashboardPage = () => {
  const { data: session } = useSession();
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [search, setSearch] = useState<string>("");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [showDropdown, setShowDropdown] = useState(false);

  const { data: studentData, loading: studentLoading } = useQuery<{ students: Student[] }>(
    STUDENTS_QUERY,
    { fetchPolicy: "network-only" }
  );

  const { data: depData } = useQuery<{ departments: Department[] }>(DEPARTMENTS_QUERY);

  const students = studentData?.students || [];
  const departments = depData?.departments || [];

  // THEME HANDLER
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

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesDepartment = !selectedDepartment || student.department?.id === selectedDepartment.id;
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        student.firstName.toLowerCase().includes(searchLower) ||
        student.lastName.toLowerCase().includes(searchLower) ||
        (student.email?.toLowerCase().includes(searchLower) ?? false) ||
        (student.matricNo?.includes(search) ?? false);
      return matchesDepartment && matchesSearch;
    });
  }, [students, selectedDepartment, search]);

  const getGpaColor = (gpa: number): string => {
    if (gpa >= 4.5) return "bg-emerald-500 text-white";
    if (gpa >= 3.5) return "bg-yellow-400 text-black";
    if (gpa >= 2.5) return "bg-orange-500 text-white";
    return "bg-red-500 text-white";
  };

  const selectedCount = selectedDepartment
    ? students.filter((s) => s.department?.id === selectedDepartment.id).length
    : students.length;

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 text-gray-100"
          : "bg-gray-50 text-gray-800"
      }`}
    >
      {/* HEADER */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
          theme === "dark"
            ? "border-gray-800 bg-gray-900/50"
            : "border-gray-200 bg-white/60"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-4 sm:px-6">
          <h1
            className={`text-xl sm:text-2xl font-extrabold tracking-tight bg-clip-text text-transparent ${
              theme === "dark"
                ? "bg-gradient-to-r from-emerald-400 to-blue-500"
                : "bg-gradient-to-r from-emerald-600 to-blue-700"
            }`}
          >
            🎓 YoüngTëch Admin
          </h1>

          {/* ADMIN DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="flex items-center gap-3 focus:outline-none"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white shadow-md ${
                  theme === "dark"
                    ? "bg-gradient-to-br from-emerald-500 to-blue-500"
                    : "bg-gradient-to-br from-emerald-600 to-blue-700"
                }`}
              >
                {session?.user?.name?.charAt(0).toUpperCase() || "A"}
              </div>
            </button>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute right-0 mt-3 w-56 rounded-xl shadow-lg border ${
                    theme === "dark"
                      ? "bg-gray-900/95 border-gray-800 text-gray-100"
                      : "bg-white border-gray-200 text-gray-700"
                  }`}
                >
                  <div className="p-4 border-b border-gray-700/50">
                    <p className="font-semibold">{session?.user?.name || "Admin"}</p>
                    {session?.user?.email && (
                      <p className="text-sm opacity-70">{session.user.email}</p>
                    )}
                  </div>

                  <div className="flex flex-col p-2">
                    <button
                      onClick={toggleTheme}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-colors"
                    >
                      {theme === "dark" ? (
                        <>
                          <SunIcon className="w-5 h-5 text-yellow-400" />
                          <span>Light Mode</span>
                        </>
                      ) : (
                        <>
                          <MoonIcon className="w-5 h-5 text-blue-600" />
                          <span>Dark Mode</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => signOut({ callbackUrl: "/signin" })}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5" />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* TOP CONTROLS */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <h2
            className={`text-3xl font-bold tracking-tight ${
              theme === "dark"
                ? "bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent"
                : "text-emerald-700"
            }`}
          >
            Student Record System
          </h2>

          <div className="flex gap-3 flex-wrap justify-center">
            <Link
              href="/departments"
              className={`px-5 py-2.5 rounded-lg text-sm font-medium shadow-md transition-all hover:scale-105 ${
                theme === "dark"
                  ? "bg-blue-600/90 hover:bg-blue-700"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              📘 Departments
            </Link>
            <Link
              href="/student/add"
              className={`px-5 py-2.5 rounded-lg text-sm font-medium shadow-md transition-all hover:scale-105 ${
                theme === "dark"
                  ? "bg-emerald-600/90 hover:bg-emerald-700"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`}
            >
              ➕ Add Student
            </Link>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <input
            type="text"
            placeholder="🔍 Search by name, email, or matric number..."
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            className={`flex-1 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
              theme === "dark"
                ? "border-gray-700 bg-gray-900/70 placeholder-gray-400 text-gray-100"
                : "border-gray-300 bg-white placeholder-gray-500 text-gray-800"
            }`}
          />

          <Listbox value={selectedDepartment} onChange={setSelectedDepartment}>
            <div className="relative w-full md:w-80">
              <Listbox.Button
                className={`w-full cursor-pointer border rounded-lg py-3 pl-4 pr-10 text-left focus:ring-2 focus:ring-emerald-500 transition-all ${
                  theme === "dark"
                    ? "border-gray-700 bg-gray-900/70 text-gray-200"
                    : "border-gray-300 bg-white text-gray-800"
                }`}
              >
                <span className="block truncate font-medium">
                  {selectedDepartment ? selectedDepartment.name : "All Departments"} ({selectedCount})
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                </span>
              </Listbox.Button>

              <Listbox.Options
                className={`absolute mt-2 max-h-60 w-full overflow-auto rounded-lg shadow-xl focus:outline-none z-10 border ${
                  theme === "dark"
                    ? "bg-gray-900 border-gray-700 text-gray-200"
                    : "bg-white border-gray-200 text-gray-800"
                }`}
              >
                <Listbox.Option key="all" value={null}>
                  {({ active, selected }) => (
                    <div
                      className={`py-3 pl-10 pr-4 cursor-pointer ${
                        active
                          ? theme === "dark"
                            ? "bg-gray-800"
                            : "bg-gray-100"
                          : ""
                      }`}
                    >
                      <span className={`${selected ? "font-semibold" : "font-normal"}`}>
                        All Departments ({students.length})
                      </span>
                      {selected && <CheckIcon className="absolute left-3 h-5 w-5 text-emerald-400" />}
                    </div>
                  )}
                </Listbox.Option>
                {departments.map((dep) => (
                  <Listbox.Option key={dep.id} value={dep}>
                    {({ active, selected }) => (
                      <div
                        className={`py-3 pl-10 pr-4 cursor-pointer ${
                          active
                            ? theme === "dark"
                              ? "bg-gray-800"
                              : "bg-gray-100"
                            : ""
                        }`}
                      >
                        <span className={`${selected ? "font-semibold" : "font-normal"}`}>
                          {dep.name} ({students.filter((s) => s.department?.id === dep.id).length})
                        </span>
                        {selected && <CheckIcon className="absolute left-3 h-5 w-5 text-emerald-400" />}
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>

        {/* STUDENT CARDS */}
        {studentLoading ? (
          <div className="flex justify-center items-center mt-24">
            <div
              className={`animate-spin rounded-full h-16 w-16 border-t-4 ${
                theme === "dark" ? "border-emerald-400" : "border-emerald-600"
              }`}
            ></div>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center mt-20">
            <p className="text-lg opacity-80">No students found.</p>
            <p className="text-sm opacity-60 mt-1">Try adjusting your filters or search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="flex gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
              <AnimatePresence>
                {filteredStudents.map((student) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className={`min-w-[260px] sm:min-w-0 rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 border ${
                      theme === "dark"
                        ? "bg-gray-900/70 border-gray-800"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    {/* Redesigned Card Layout */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                      <Avatar
                        src={student.profilePicture}
                        firstName={student.firstName}
                        lastName={student.lastName}
                        size="lg"
                        theme={theme}
                      />

                      <div className="flex-1">
                        <h3 className="text-xl font-semibold">{student.firstName} {student.lastName}</h3>
                        <div className="mt-1 text-sm sm:text-base space-y-1 opacity-90">
                          <p><span className="font-medium">Matric No:</span> {student.matricNo || "—"}</p>
                          <p><span className="font-medium">Email:</span> {student.email || "—"}</p>
                          <p><span className="font-medium">Department:</span> {student.department?.name || "—"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Compact bottom row for GPA & View */}
                    <div className="flex justify-between items-center mt-4 flex-wrap gap-2">
                      <span className={`${getGpaColor(student.gpa)} px-3 py-1.5 rounded-full text-sm font-semibold`}>
                        GPA: {student.gpa.toFixed(2)}
                      </span>
                      <Link
                        href={`/student/${student.id}`}
                        className={`font-medium text-sm flex items-center gap-1 transition-colors ${
                          theme === "dark"
                            ? "text-emerald-400 hover:text-emerald-300"
                            : "text-emerald-600 hover:text-emerald-700"
                        }`}
                      >
                        View ➜
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
