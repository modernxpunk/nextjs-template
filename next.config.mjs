import { createJiti } from "jiti";
import { fileURLToPath } from "node:url";
import createNextIntlPlugin from "next-intl/plugin"

const jiti = createJiti(fileURLToPath(import.meta.url));
await jiti.import("./src/env/server");
await jiti.import("./src/env/client");

/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "standalone",
	transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"]
};

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

export default withNextIntl(nextConfig);
