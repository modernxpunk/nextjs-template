/** @type {import('next').NextConfig} */

// const withBundleAnalyzer = require("@next/bundle-analyzer")({
// 	enabled: process.env.ANALYZE === "true",
// })

const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		domains: ["picsum.photos"],
	},
	compiler: {
		// removeConsole: {
		// exclude: ['error'],
		// },
	},
};

module.exports = nextConfig;
