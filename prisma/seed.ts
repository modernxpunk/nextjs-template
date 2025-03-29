import { PrismaClient, type Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
	{
		name: 'Alice',
		email: 'alice@prisma.io',
		"password": "password1",
	},
	{
		name: 'Bob',
		email: 'bob@prisma.io',
		"password": "password2",
	}
]

const main = async () => {
	for (const u of userData) {
		await prisma.user.create({ data: u })
	}
}

main()
	.catch(e => {
		throw e
	})
	.finally(async () => {
		await prisma.$disconnect()
	})