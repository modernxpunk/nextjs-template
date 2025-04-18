"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";

const ProfileButton = () => {
	const { data: session, isPending } = useSession();

	return (
		<Button>
			{isPending ? (
				<Skeleton className="h-4 bg-primary w-[100px]" />
			) : (
				session?.user.email
			)}
		</Button>
	);
};

export default ProfileButton;
