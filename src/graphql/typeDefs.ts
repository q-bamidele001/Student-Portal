import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Department {
    id: ID!
    name: String!
    code: String
  }

  type Student {
    id: ID!
    firstName: String!
    lastName: String!
    matricNo: String
    email: String
    gpa: Float!
    department: Department
  }

  input StudentInput {
    firstName: String!
    lastName: String!
    matricNo: String
    email: String
    gpa: Float!
    departmentId: ID
  }

  input DepartmentInput {
    name: String!
    code: String
  }

  type Query {
    students: [Student!]!
    student(id: ID!): Student
    departments: [Department!]!
    department(id: ID!): Department
  }

  type Mutation {
    addStudent(input: StudentInput!): Student!
    updateStudent(id: ID!, input: StudentInput!): Student!
    deleteStudent(id: ID!): Boolean!

    addDepartment(input: DepartmentInput!): Department!
    updateDepartment(id: ID!, input: DepartmentInput!): Department!
    deleteDepartment(id: ID!): Boolean!
  }
`;