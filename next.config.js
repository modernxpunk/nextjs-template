const withNextIntl = require("next-intl/plugin")("./src/lib/i18n/config.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		domains: ["picsum.photos"],
	},
};

module.exports = withNextIntl(nextConfig);
