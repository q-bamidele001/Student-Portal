import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { Admin } from "@/models/Admin";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(new URL("/signin?error=invalid_token", req.url));
    }

    await dbConnect();

    const admin = await Admin.findOne({ verificationToken: token });

    if (!admin) {
      return NextResponse.redirect(new URL("/signin?error=invalid_token", req.url));
    }

    admin.emailVerified = true;
    admin.verificationToken = undefined;
    await admin.save();

    return NextResponse.redirect(new URL("/signin?verified=true", req.url));

  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.redirect(new URL("/signin?error=verification_failed", req.url));
  }
}