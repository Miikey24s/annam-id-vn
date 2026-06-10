import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export const proxy = createMiddleware(routing);

export const config = {
  // Match all pathnames except for the ones starting with:
  // - api (API routes)
  // - _next (Next.js internals like static files, image optimization)
  // - static files with extensions (e.g. favicon.ico, images)
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
