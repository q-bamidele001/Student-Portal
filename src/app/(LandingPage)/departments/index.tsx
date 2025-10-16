"use client";

import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useState, FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import { Department } from "@/types";

const GET_DEPARTMENTS = gql`
  query Departments {
    departments {
      id
      name
      code
    }
  }
`;

const ADD_DEPARTMENT = gql`
  mutation AddDepartment($input: DepartmentInput!) {
    addDepartment(input: $input) {
      id
      name
      code
    }
  }
`;

const UPDATE_DEPARTMENT = gql`
  mutation UpdateDepartment($id: ID!, $input: DepartmentInput!) {
    updateDepartment(id: $id, input: $input) {
      id
      name
      code
    }
  }
`;

const DELETE_DEPARTMENT = gql`
  mutation DeleteDepartment($id: ID!) {
    deleteDepartment(id: $id)
  }
`;

const DepartmentsPage = () => {
  const { data, loading, refetch } = useQuery<{ departments: Department[] }>(GET_DEPARTMENTS);

  const [addDepartment] = useMutation(ADD_DEPARTMENT, {
    onCompleted: () => {
      refetch();
      setForm({ name: "", code: "" });
      setEditingId(null);
    },
  });

  const [updateDepartment] = useMutation(UPDATE_DEPARTMENT, {
    onCompleted: () => {
      refetch();
      setForm({ name: "", code: "" });
      setEditingId(null);
    },
  });

  const [deleteDepartment] = useMutation(DELETE_DEPARTMENT, { onCompleted: () => refetch() });

  const [form, setForm] = useState({ name: "", code: "" });
  const [error, setError] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name) {
      setError("Department name is required");
      return;
    }

    try {
      if (editingId) {
        await updateDepartment({ variables: { id: editingId, input: { name: form.name, code: form.code || null } } });
      } else {
        await addDepartment({ variables: { input: { name: form.name, code: form.code || null } } });
      }
      setError("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleEdit = (dept: Department) => {
    setEditingId(dept.id);
    setForm({ name: dept.name, code: dept.code || "" });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this department?")) deleteDepartment({ variables: { id } });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ name: "", code: "" });
    setError("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Departments
          </h1>
          <Link href="/" className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2.5 rounded-lg transition-all duration-200 hover:scale-105 font-medium">
            ← Back
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-xl mb-8 border border-gray-700">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="Department Name *"
              value={form.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })}
              className="flex-1 px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none text-gray-100 placeholder-gray-400 transition-all duration-200"
            />
            <input
              type="text"
              placeholder="Code (optional)"
              value={form.code}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, code: e.target.value })}
              className="flex-1 px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none text-gray-100 placeholder-gray-400 transition-all duration-200"
            />
            <button
              type="submit"
              className={`px-6 py-3 rounded-lg font-bold text-white transition-all duration-200 hover:scale-105 shadow-lg ${
                editingId ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/50" : "bg-green-600 hover:bg-green-700 shadow-green-500/50"
              }`}
            >
              {editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-100 font-bold transition-all duration-200 hover:scale-105"
              >
                Cancel
              </button>
            )}
          </div>
          {error && <p className="text-red-400 text-sm mt-3 font-medium bg-red-900/30 px-4 py-2 rounded-lg border border-red-800">{error}</p>}
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {data?.departments.map((dept) => (
            <div key={dept.id} className="bg-gray-900/80 backdrop-blur-md p-6 rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200 border border-gray-700 hover:border-blue-500">
              <h2 className="text-xl font-semibold text-gray-100 mb-2">{dept.name}</h2>
              <p className="text-gray-400 mb-4 text-sm">
                <span className="font-medium text-gray-300">Code:</span> {dept.code || "—"}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(dept)}
                  className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200 hover:scale-105"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(dept.id)}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-all duration-200 hover:scale-105"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {data?.departments.length === 0 && (
          <div className="text-center mt-20">
            <p className="text-gray-400 text-xl">No departments yet.</p>
            <p className="text-gray-500 mt-2">Add your first department above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentsPage;