const createNextIntlPlugin = require("next-intl/plugin");
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	output: "standalone",
	eslint: {
		ignoreDuringBuilds: true,
	},
};

module.exports = withNextIntl(nextConfig);
