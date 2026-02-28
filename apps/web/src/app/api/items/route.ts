import { db, item } from "@repo/db";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		const items = await db.select().from(item);
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
		const inserted = await db
			.insert(item)
			.values({
				id: crypto.randomUUID(),
				name: body.name,
				userId: body.userId,
			})
			.returning();

		return NextResponse.json(inserted[0], { status: 201 });
	} catch (error) {
		console.error("Error creating user:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 },
		);
	}
}
