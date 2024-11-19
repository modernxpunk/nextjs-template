/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	output: "standalone",
	eslint: {
		ignoreDuringBuilds: true,
	},
	experimental: {
		swcPlugins: [["typewind/swc", {}]],
	},
};

module.exports = nextConfig;
