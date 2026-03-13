import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/contacts/:path*",
    "/api/campaigns/:path*",
    "/api/press-releases/:path*",
    "/api/pitch-requests/:path*",
    "/api/media-mentions/:path*",
    "/api/analytics/:path*",
    "/api/venues/:path*",
    "/api/contact-lists/:path*",
    "/api/ghl/:path*",
    "/api/truefans/:path*",
    "/api/epk",
  ],
};
