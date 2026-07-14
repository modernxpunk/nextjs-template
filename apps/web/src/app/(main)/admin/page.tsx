import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboard from "@/app/(main)/admin/admin-dashboard";
import { env } from "@/env/server";
import { isAdminRole } from "@/lib/auth-roles";
import {
	isSessionResponse,
	type SessionResponse,
} from "@/lib/session-response";

const getSession = async (): Promise<SessionResponse | null> => {
	try {
		const cookieStore = await cookies();
		const response = await fetch(`${env.API_URL}/api/auth/get-session`, {
			headers: {
				cookie: cookieStore.toString(),
			},
			cache: "no-store",
			signal: AbortSignal.timeout(5000),
		});

		if (!response.ok) {
			return null;
		}

		const data: unknown = await response.json();
		return isSessionResponse(data) ? data : null;
	} catch {
		return null;
	}
};

const AdminPage = async () => {
	const session = await getSession();

	if (!session) {
		redirect("/auth/sign-in");
	}

	if (!isAdminRole(session.user?.role)) {
		redirect("/");
	}

	return <AdminDashboard />;
};

export default AdminPage;
