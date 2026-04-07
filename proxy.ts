import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedPageRoute = createRouteMatcher([
  "/customers(.*)",
  "/calendar(.*)",
  "/team(.*)",
  "/settings(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;

  const isProtectedApiRoute =
    pathname.startsWith("/api/subscription") ||
    pathname.startsWith("/api/stats") ||
    pathname.startsWith("/api/usage") ||
    pathname.startsWith("/api/reviews") ||
    pathname.startsWith("/api/jobs") ||
    pathname.startsWith("/api/settings") ||
    pathname.startsWith("/api/team") ||
    pathname.startsWith("/api/export") ||
    (pathname.startsWith("/api/payfast") &&
      !pathname.startsWith("/api/payfast/notify"));

  if (isProtectedPageRoute(req) || isProtectedApiRoute) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpg|jpeg|gif|png|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};