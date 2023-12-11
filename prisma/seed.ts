import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
	await prisma.user.deleteMany();

	const users = faker.helpers.multiple(
		() => {
			return {
				email: faker.internet.email(),
				name: faker.internet.userName(),
			};
		},
		{ count: 10 },
	);

	await prisma.user.createMany({
		data: users,
		skipDuplicates: true,
	});
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
