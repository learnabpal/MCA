import type { NextConfig } from "next";




const nextConfig: NextConfig = {
	  /* config options here   */
	  reactCompiler: true,
	  reactStrictMode: false,
	  typescript: {
			 ignoreBuildErrors: true
	  },
	  modularizeImports: {
			 "@mui/material": {
					transform: "@mui/material/{{member}}",
					preventFullImport: true
			 },
			 "@mui/icons-material": {
					transform: "@mui/icons-material/{{member}}",
					preventFullImport: true
			 }
	  },
	  experimental: { optimizePackageImports: [ "@mui/material", "@mui/icons-material" ] },
	  images: {
			 dangerouslyAllowLocalIP: true,
			 remotePatterns: [
					{ protocol: "https", hostname: "**" },
					{ protocol: "http", hostname: "**" },
					{ protocol: "https", hostname: "firebasestorage.googleapis.com" },
					{ protocol: "https", hostname: "*.googleusercontent.com" }
			 ]
	  }
};

export default nextConfig;
