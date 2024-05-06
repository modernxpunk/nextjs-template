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
};
