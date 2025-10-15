"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { useState, useMemo, ChangeEvent } from "react";
import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import { Department, Student } from "@/types";

const STUDENTS_QUERY = gql`
  query Students {
    students {
      id
      firstName
      lastName
      email
      matricNo
      gpa
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
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [search, setSearch] = useState<string>("");

  const { data: studentData, loading: studentLoading } = useQuery<{ students: Student[] }>(
    STUDENTS_QUERY,
    { fetchPolicy: "network-only" }
  );

  const { data: depData } = useQuery<{ departments: Department[] }>(DEPARTMENTS_QUERY);

  const students = studentData?.students || [];
  const departments = depData?.departments || [];

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
    if (gpa >= 4.5) return "bg-green-500";
    if (gpa >= 3.5) return "bg-yellow-400";
    if (gpa >= 2.5) return "bg-orange-500";
    return "bg-red-500";
  };

  const selectedCount = selectedDepartment
    ? students.filter((s) => s.department?.id === selectedDepartment.id).length
    : students.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent animate-pulse">
            YoüngTëch Student Portal
          </h1>
          <div className="flex gap-3">
            <Link
              href="/departments"
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 shadow-lg transition-transform duration-200 hover:scale-105 font-medium"
            >
              📚 Departments
            </Link>
            <Link
              href="/student/add"
              className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 shadow-lg transition-transform duration-200 hover:scale-105 font-medium"
            >
              + Add Student
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-8 items-center">
          <input
            type="text"
            placeholder="🔍 Search by name, email or matric number..."
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            className="flex-1 border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none bg-gray-800 text-gray-100 placeholder-gray-400 transition-all duration-200"
          />

          <Listbox value={selectedDepartment} onChange={setSelectedDepartment}>
            <div className="relative w-full md:w-80">
              <Listbox.Button className="relative w-full cursor-pointer border border-gray-700 rounded-lg bg-gray-800 py-3 pl-4 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 hover:border-gray-600">
                <span className="block truncate font-medium">
                  {selectedDepartment ? selectedDepartment.name : "All Departments"} ({selectedCount})
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                </span>
              </Listbox.Button>

              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-gray-800 py-1 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-10 border border-gray-700">
                <Listbox.Option
                  key="all"
                  value={null}
                  className={({ active }) =>
                    `cursor-pointer select-none relative py-3 pl-10 pr-4 transition-colors ${
                      active ? "bg-gray-700 text-white" : "text-gray-100"
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? "font-bold" : "font-normal"}`}>
                        All Departments ({students.length})
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-400">
                          <CheckIcon className="h-5 w-5" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>

                {departments.map((dep) => (
                  <Listbox.Option
                    key={dep.id}
                    value={dep}
                    className={({ active }) =>
                      `cursor-pointer select-none relative py-3 pl-10 pr-4 transition-colors ${
                        active ? "bg-gray-700 text-white" : "text-gray-100"
                      }`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? "font-bold" : "font-normal"}`}>
                          {dep.name} ({students.filter((s) => s.department?.id === dep.id).length})
                        </span>
                        {selected && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-400">
                            <CheckIcon className="h-5 w-5" />
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>

        {studentLoading ? (
          <div className="flex justify-center items-center mt-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-400"></div>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center mt-20">
            <p className="text-gray-400 text-xl">No students found.</p>
            <p className="text-gray-500 mt-2">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredStudents.map((student) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 hover:scale-105 hover:shadow-2xl transition-all duration-200 border border-gray-700 hover:border-green-500"
                >
                  <h2 className="text-xl font-semibold text-gray-100 mb-3">
                    {student.firstName} {student.lastName}
                  </h2>
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-400 text-sm">
                      <span className="font-medium text-gray-300">Matric No:</span> {student.matricNo || "—"}
                    </p>
                    <p className="text-gray-400 text-sm">
                      <span className="font-medium text-gray-300">Email:</span> {student.email || "—"}
                    </p>
                    <p className="text-gray-400 text-sm">
                      <span className="font-medium text-gray-300">Department:</span> {student.department?.name || "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`${getGpaColor(student.gpa)} px-3 py-1 rounded-full text-black font-bold`}>
                      {student.gpa.toFixed(2)}
                    </span>
                    <Link
                      href={`/student/${student.id}`}
                      className="ml-auto text-green-400 hover:text-green-300 font-medium transition-colors duration-200"
                    >
                      View ➔
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
