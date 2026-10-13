import { errorOccurred, successResponse } from "@/firebase/Bridge";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";


const SITE_KEY = "0x4AAAAAAC8HszH_063gO4QQ";
const CLOUDFLARE_SECRET = "0x4AAAAAAC8Hs7HXbbrL6u1jexetI6KY-Fs";


export async function GET() {
	  return NextResponse.json({ siteKey: SITE_KEY });
}


export async function POST(req: NextRequest) {
	  try {
			 const { token } = await req.json();
			 
			 if ( /*NOT->*/ ! token) {
					return errorOccurred("Verification token missing.", {});
			 }
			 
			 const verifyResponse = await axios.post(
						"https://challenges.cloudflare.com/turnstile/v0/siteverify",
						new URLSearchParams({
							  secret: CLOUDFLARE_SECRET,
							  response: token
						})
			 );
			 
			 if ( /*NOT->*/ ! verifyResponse.data.success) {
					return errorOccurred("Verification failed.", {});
			 }
			 
			 return successResponse({ message: "Verified successfully." });
			 
	  } catch (e) {
			 return errorOccurred(e, {});
	  }
}
