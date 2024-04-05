const path = require("node:path");

const buildEslintCommand = (filenames) =>
	`next lint --ignore-path .gitignore --cache --fix --file ${filenames
		.map((f) => path.relative(process.cwd(), f))
		.join(" --file ")}`;

const prettierCommand = (filenames) =>
	`prettier --ignore-path .gitignore --write ${filenames.join(" ")}`;

const typescriptCommand = (filenames) =>
	`bash -c tsc --pretty --noEmit --project tsconfig.json ${filenames.join(" ")}`;

module.exports = {
	"./src/**/*.{js,jsx,ts,tsx}": [
		buildEslintCommand,
		prettierCommand,
		typescriptCommand,
	],
};
