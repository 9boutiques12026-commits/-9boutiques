import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth?.token;

    if (pathname.startsWith("/dev") && token?.role !== "developer") {
      return Response.redirect(new URL("/login", req.url));
    }

    if (pathname.startsWith("/admin") && !["admin", "developer"].includes(String(token?.role))) {
      return Response.redirect(new URL("/login", req.url));
    }

    return null;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  },
);

export const config = {
  matcher: ["/admin/:path*", "/dev/:path*"],
};
