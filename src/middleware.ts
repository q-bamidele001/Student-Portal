import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: [
    /*
     * Match all routes EXCEPT:
     * - /api/auth/* (NextAuth API routes)
     * - /signin, /signup (public auth pages)
     * - /_next/* (Next.js internals)
     * - /favicon.ico, static files
     */
    "/((?!api/auth|signin|signup|_next|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
  ],
};