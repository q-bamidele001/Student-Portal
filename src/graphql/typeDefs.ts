import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Department {
    id: ID!
    name: String!
    code: String
    students: [Student]
  }

  type Student {
    id: ID!
    firstName: String!
    lastName: String!
    matricNo: String
    email: String
    gpa: Float!
    department: Department
    profilePicture: String
  }

  input StudentInput {
    firstName: String!
    lastName: String!
    matricNo: String
    email: String
    gpa: Float!
    departmentId: ID
    profilePicture: String
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