import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongoose";
import { Admin } from "@/models/Admin";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        await dbConnect();
        const admin = await Admin.findOne({ email: credentials.email });

        if (!admin) {
          throw new Error("No admin found with this email");
        }

        if (!admin.emailVerified) {
          throw new Error("Please verify your email first");
        }

        const isValid = await bcrypt.compare(credentials.password, admin.password);

        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: admin.id || admin._id?.toString() || "",
          email: admin.email,
          name: admin.name,
          role: admin.role,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
});

export { handler as GET, handler as POST };