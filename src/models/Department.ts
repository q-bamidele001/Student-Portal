import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDepartment extends Document {
  name: string;
  code?: string;
}

const DepartmentSchema: Schema<IDepartment> = new Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
  },
  code: { 
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

export const Department: Model<IDepartment> =
  mongoose.models.Department || mongoose.model<IDepartment>("Department", DepartmentSchema);