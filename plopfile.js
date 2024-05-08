module.exports = function (plop) {
	plop.setGenerator("form", {
		description: "Generate a form",
		prompts: [
			{
				type: "input",
				name: "name",
				message: "Enter the component form name:",
			},
		],
		actions: [
			{
				type: "add",
				force: true,
				path: "src/components/forms/{{lowerCase name}}.tsx",
				templateFile: "plop-templates/form.hbs",
			},
		],
	});
	plop.setGenerator("modal", {
		description: "Generate a modal",
		prompts: [
			{
				type: "input",
				name: "name",
				message: "Enter the component modal name:",
			},
		],
		actions: [
			{
				type: "add",
				force: true,
				path: "src/components/modal/content/{{kebabCase name}}.tsx",
				templateFile: "plop-templates/modal.hbs",
			},
			{
				type: "append",
				path: "src/components/modal/builder.tsx",
				pattern: /(\/\/ New import)/g,
				template: `import {{pascalCase name}} from "@/components/modal/content/{{kebabCase name}}";`,
			},
			{
				type: "append",
				path: "src/components/modal/builder.tsx",
				pattern: /(\/\/ New modal)/g,
				template: `\t{ id: "{{dashCase name}}", Modal: {{pascalCase name}} },`,
			},
		],
	});
};
