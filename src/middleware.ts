import { NextResponse, type NextRequest } from "next/server";

const CANONICAL_HOSTNAME = "yeetrun.com";
const INDEXABLE_HOSTS = new Set([CANONICAL_HOSTNAME, "www.yeetrun.com"]);

function resolveHostname(request: NextRequest): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost ?? request.headers.get("host") ?? "";

  return host.split(":")[0].toLowerCase();
}

function resolveProtocol(request: NextRequest): string {
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const protocol = forwardedProto ?? request.nextUrl.protocol;

  return protocol.replace(/:$/, "").toLowerCase();
}

export function middleware(request: NextRequest) {
  const hostname = resolveHostname(request);

  if (hostname === CANONICAL_HOSTNAME && resolveProtocol(request) === "http") {
    const url = request.nextUrl.clone();
    url.protocol = "https";
    url.hostname = CANONICAL_HOSTNAME;
    url.port = "";

    return NextResponse.redirect(url, 308);
  }

  const response = NextResponse.next();

  if (!INDEXABLE_HOSTS.has(hostname)) {
    response.headers.set("X-Robots-Tag", "noindex");
  }

  return response;
}
