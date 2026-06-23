import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAdminCookieName, verifyAdminToken } from "@/lib/adminAuth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Maintenance mode check
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === "true";
  const isMaintenancePage = pathname === "/maintenance";
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  const isStaticFile = pathname.includes(".") || pathname.startsWith("/_next") || pathname.startsWith("/favicon");

  if (isMaintenanceMode && !isMaintenancePage && !isAdminPage && !isAdminApi && !isStaticFile) {
    const url = req.nextUrl.clone();
    url.pathname = "/maintenance";
    return NextResponse.redirect(url);
  }

  // Prevent accessing maintenance page if not in maintenance mode
  if (!isMaintenanceMode && isMaintenancePage) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  const isLogin = pathname === "/admin/login" || pathname === "/api/admin/login";

  if (!isAdminPage && !isAdminApi) return NextResponse.next();
  if (isLogin) return NextResponse.next();

  const token = req.cookies.get(getAdminCookieName())?.value;
  const ok = await verifyAdminToken(token);

  if (ok) return NextResponse.next();

  if (isAdminApi) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api/public|_next/static|_next/image|favicon.ico).*)"],
};

