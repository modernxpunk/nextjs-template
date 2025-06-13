import { PrismaClient, type Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const now = new Date()

const userData: Prisma.UserCreateInput[] = [
	{
		id: '1',
		name: 'Alice',
		email: 'alice@prisma.io',
		emailVerified: false,
		createdAt: now,
		updatedAt: now
	},
	{
		id: '2',
		name: 'Bob',
		email: 'bob@prisma.io',
		emailVerified: false,
		createdAt: now,
		updatedAt: now
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
