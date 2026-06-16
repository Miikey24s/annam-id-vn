import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Check if it's an admin path
  // Matches: /admin, /admin/..., /vi/admin, /vi/admin/..., /en/admin, /en/admin/...
  const isAdminPath =
    /^\/(vi|en)?\/?admin(\/|$)/.test(pathname) &&
    !/^\/(vi|en)?\/?admin\/login(\/|$)/.test(pathname);

  if (isAdminPath && !user) {
    // Determine the redirect locale prefix
    const localePrefix = pathname.startsWith("/en") ? "/en" : "";
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `${localePrefix}/admin/login`;
    return NextResponse.redirect(redirectUrl);
  }

  // If already logged in and visiting login, redirect to admin dashboard
  const isLoginPath = /^\/(vi|en)?\/?admin\/login(\/|$)/.test(pathname);
  if (isLoginPath && user) {
    const localePrefix = pathname.startsWith("/en") ? "/en" : "";
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `${localePrefix}/admin`;
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
