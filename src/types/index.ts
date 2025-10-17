export interface Department {
  id: string;
  name: string;
  code?: string | null;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  matricNo?: string | null;
  email?: string | null;
  gpa: number;
  department?: Department | null;
  profilePicture?: string;
}

export interface StudentInput {
  firstName: string;
  lastName: string;
  matricNo?: string;
  email?: string;
  gpa: number;
  departmentId?: string;
}

export interface DepartmentInput {
  name: string;
  code?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}