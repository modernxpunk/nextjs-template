"use client";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@repo/ui/components/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Skeleton } from "@repo/ui/components/skeleton";
import {
	LogOut,
	Moon,
	Settings,
	ShieldCheck,
	Sun,
	UserCheck,
	Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { authClient, signOut, useSession } from "@/lib/auth-client";
import { isAdminRole } from "@/lib/auth-roles";
import { formatAddress } from "@/lib/utils";

const ProfileButton = () => {
	const router = useRouter();
	const t = useTranslations();
	const { resolvedTheme: theme, setTheme } = useTheme();
	const { data: session, isPending, refetch } = useSession();
	const { address, isConnected } = useAccount();
	const { connectors, connect } = useConnect();
	const { disconnect } = useDisconnect();

	const toggleTheme = (e: Event) => {
		e.preventDefault();

		setTheme(theme === "dark" ? "light" : "dark");
	};

	const handleConnectionToggle = (e: Event) => {
		e.preventDefault();

		if (isConnected) {
			disconnect();
		} else {
			if (connectors[0]) {
				connect({ connector: connectors[0] });
			}
		}
	};

	const handleSignOut = async (e: Event) => {
		e.preventDefault();

		try {
			const { error } = await signOut({
				fetchOptions: {
					onSuccess: () => {
						router.push("/auth/sign-in");
					},
				},
			});
			if (error) toast.error(error.message || "Failed to sign out");
		} catch {
			toast.error("Failed to sign out");
		}
	};

	const handleStopImpersonating = async (e: Event) => {
		e.preventDefault();

		const { error } = await authClient.admin.stopImpersonating();
		if (error) {
			toast.error(error.message || "Failed to stop impersonating");
			return;
		}

		await refetch();
		router.refresh();
	};

	const isAdmin = isAdminRole(session?.user.role);
	const isImpersonating = Boolean(session?.session.impersonatedBy);
	const avatarUrl = session?.user.image ?? undefined;
	const fallbackLabel = (session?.user.name || session?.user.email || "")
		.charAt(0)
		.toUpperCase();

	const menuLabel = session?.user.name || session?.user.email;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				aria-label="Open profile menu"
				className="rounded-full"
				disabled={isPending}
			>
				<Avatar>
					<AvatarImage
						alt={session?.user.name || "Profile avatar"}
						className="object-cover"
						src={avatarUrl}
					/>
					{isPending ? (
						<Skeleton className="h-full w-full rounded-full motion-reduce:animate-none" />
					) : (
						<AvatarFallback className="bg-primary text-primary-foreground">
							{fallbackLabel}
						</AvatarFallback>
					)}
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" sideOffset={8}>
				<DropdownMenuLabel>{menuLabel}</DropdownMenuLabel>
				<DropdownMenuItem
					className="flex items-center gap-2"
					onSelect={handleConnectionToggle}
				>
					{isConnected && address ? (
						<>
							<div className="flex items-center gap-2">
								<Wallet aria-hidden="true" />
								{formatAddress(address)}
							</div>
							<span className="ml-auto text-muted-foreground text-xs">
								{t("home.disconnect")}
							</span>
						</>
					) : (
						<div className="flex items-center gap-2">
							<Wallet aria-hidden="true" />
							{t("home.connectWallet")}
						</div>
					)}
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onSelect={toggleTheme}>
					{theme === "light" ? (
						<Sun aria-hidden="true" />
					) : (
						<Moon aria-hidden="true" />
					)}
					Theme
					<span className="ml-auto text-muted-foreground text-xs">
						{theme === "light" ? "Light" : "Dark"}
					</span>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onSelect={() => router.push("/settings")}>
					<Settings aria-hidden="true" />
					Settings
				</DropdownMenuItem>
				{isAdmin ? (
					<DropdownMenuItem onSelect={() => router.push("/admin")}>
						<ShieldCheck aria-hidden="true" />
						Admin
					</DropdownMenuItem>
				) : null}
				{isImpersonating ? (
					<DropdownMenuItem onSelect={handleStopImpersonating}>
						<UserCheck aria-hidden="true" />
						Stop impersonating
					</DropdownMenuItem>
				) : null}
				<DropdownMenuItem onSelect={handleSignOut} variant="destructive">
					<LogOut aria-hidden="true" />
					{t("home.signOut")}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default ProfileButton;
