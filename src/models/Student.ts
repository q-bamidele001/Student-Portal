import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStudent extends Document {
  firstName: string;
  lastName: string;
  matricNo?: string;
  email?: string;
  gpa: number;
  department?: mongoose.Types.ObjectId;
}

const StudentSchema: Schema<IStudent> = new Schema({
  firstName: { 
    type: String, 
    required: true,
    trim: true,
  },
  lastName: { 
    type: String, 
    required: true,
    trim: true,
  },
  matricNo: { 
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  email: { 
    type: String,
    trim: true,
    lowercase: true,
  },
  gpa: { 
    type: Number, 
    required: true,
    min: 0,
    max: 5,
    default: 0,
  },
  department: { 
    type: Schema.Types.ObjectId, 
    ref: "Department",
  },
}, {
  timestamps: true,
});

export const Student: Model<IStudent> =
  mongoose.models.Student || mongoose.model<IStudent>("Student", StudentSchema);