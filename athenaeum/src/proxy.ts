import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";




export function proxy(request: NextRequest) {
	  const path = request.nextUrl.pathname.toLowerCase();
	  
	  const blocked = [
			 "wp-",
			 "/wp-json",
			 "/wp-includes",
			 "/wp-content",
			 "xmlrpc.php",
			 "security.txt",
			 // "robots.txt",
			 "/.env",
			 "/.git",
			 ".env.",
			 ".git/",
			 "phpinfo.php",
			 "php-info.php",
			 "info.php",
			 "config.php",
			 "config.js",
			 "aws.config.js",
			 "aws-config.js",
			 "/aws.",
			 "/aws/",
			 "_next/static/chunks",
			 "system/js/core.js"
	  ];
	  
	  if (blocked.some((v) => /*TRUTHY->*/ path.includes(v))) {
			 return new NextResponse("Not Found", { status: 404, headers: { "cache-control": "no-store, max-age=0" } });
	  }
	  
	  return NextResponse.next();
}

export const config = {
	  matcher: [ "/", "/((?!_next|favicon.ico).*)" ]
};
