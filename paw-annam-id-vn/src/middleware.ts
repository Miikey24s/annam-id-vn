import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "./lib/supabase/middleware";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // 1. Run Supabase session refresh and route checks
  const supabaseResponse = await updateSession(request);

  // If supabaseResponse is a redirect (e.g. unauthorized admin redirect), return it immediately
  if (
    supabaseResponse.status === 307 ||
    supabaseResponse.status === 308 ||
    supabaseResponse.headers.get("Location")
  ) {
    return supabaseResponse;
  }

  // 2. Run i18n localization routing
  const intlResponse = intlMiddleware(request);

  // 3. Merge Supabase session cookies into the i18n response
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value, {
      path: cookie.path,
      domain: cookie.domain,
      secure: cookie.secure,
      sameSite: cookie.sameSite,
      expires: cookie.expires,
      maxAge: cookie.maxAge,
      httpOnly: cookie.httpOnly,
    });
  });

  return intlResponse;
}

export const config = {
  // Match all pathnames except for:
  // - api routes (/api/*)
  // - _next internals (/_next/*)
  // - static files with extensions (e.g. favicon.ico, images)
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
