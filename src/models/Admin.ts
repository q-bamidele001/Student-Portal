import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  role: "super_admin";
  emailVerified: boolean;
  verificationToken?: string;
  createdAt: Date;
}

const AdminSchema: Schema<IAdmin> = new Schema({
  name: { 
    type: String, 
    required: true,
    trim: true,
  },
  email: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { 
    type: String, 
    required: true,
  },
  role: {
    type: String,
    enum: ["super_admin"],
    default: "super_admin",
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
}, {
  timestamps: true,
});

export const Admin: Model<IAdmin> =
  mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);