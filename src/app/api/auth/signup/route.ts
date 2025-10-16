import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dbConnect from "@/lib/mongoose";
import { Admin } from "@/models/Admin";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    await dbConnect();

    const existing = await Admin.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      emailVerified: false,
    });

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${verificationToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Verify your email",
      html: `
        <h2>Welcome as 🎓 YoüngTëch College Admin!</h2>
        <p>Click the link below to verify your email:</p>
        <a href="${verifyUrl}">${verifyUrl}</a>
        <p>This link will expire in 24 hours.</p>
      `,
    });

    return NextResponse.json({ 
      message: "Account created! Check your email to verify." 
    }, { status: 201 });

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}