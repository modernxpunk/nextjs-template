import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		const items = await prisma.item.findMany();
		return NextResponse.json(items);
	} catch (error) {
		console.error("Error fetching items:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json();
		const user = await prisma.item.create({
			data: {
				name: body.name,
				user: {
					connect: { id: body.userId },
				},
			},
		});

		return NextResponse.json(user, { status: 201 });
	} catch (error) {
		console.error("Error creating user:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 },
		);
	}
}
