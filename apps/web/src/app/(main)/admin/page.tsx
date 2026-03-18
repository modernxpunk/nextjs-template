import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboard from "@/app/(main)/admin/admin-dashboard";
import { env } from "@/env/server";
import { isAdminRole } from "@/lib/auth-roles";

type SessionResponse = {
	user?: {
		role?: string | string[] | null;
	};
};

const getSession = async (): Promise<SessionResponse | null> => {
	try {
		const cookieStore = await cookies();
		const response = await fetch(`${env.API_URL}/api/auth/get-session`, {
			headers: {
				cookie: cookieStore.toString(),
			},
			cache: "no-store",
		});

		if (!response.ok) {
			return null;
		}

		const data = (await response.json()) as SessionResponse;
		return data;
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
