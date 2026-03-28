import { NextResponse, type NextRequest } from "next/server";

const INDEXABLE_HOSTS = new Set(["yeetrun.com", "www.yeetrun.com"]);

function resolveHostname(request: NextRequest): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost ?? request.headers.get("host") ?? "";

  return host.split(":")[0].toLowerCase();
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (!INDEXABLE_HOSTS.has(resolveHostname(request))) {
    response.headers.set("X-Robots-Tag", "noindex");
  }

  return response;
}
