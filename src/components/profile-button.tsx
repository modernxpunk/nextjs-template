"use client";

import { signOut, useSession } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "./ui/skeleton";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Moon, Settings, Sun, Wallet } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { formatAddress } from "@/lib/utils";
import { Button } from "./ui/button";
import type { MouseEvent } from "react";
import { useTranslations } from "next-intl";

const ProfileButton = () => {
	const router = useRouter();
	const t = useTranslations();
	const { resolvedTheme: theme, setTheme } = useTheme();
	const { data: session, isPending } = useSession();
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
			connect({ connector: connectors[0] });
		}
	};

	const handleSignOut = async (e: Event) => {
		e.preventDefault();

		await signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push("/auth/sign-in");
				},
			},
		});
	};

	const avatarUrl = session?.user.image ?? undefined;
	const fallbackLabel = (session?.user.name || session?.user.email || "")
		.charAt(0)
		.toUpperCase();

	const menuLabel = session?.user.name || session?.user.email;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger disabled={isPending} className="rounded-full">
				<Avatar>
					<AvatarImage src={avatarUrl} />
					{isPending ? (
						<Skeleton className="h-full w-full rounded-full" />
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
					onSelect={handleConnectionToggle}
					className="flex items-center gap-2"
				>
					{isConnected ? (
						<>
							<div className="flex items-center gap-2">
								<Wallet />
								{formatAddress(address as `0x${string}`)}
							</div>
							<span className="ml-auto text-xs text-muted-foreground">
								{t("home.disconnect")}
							</span>
						</>
					) : (
						<div className="flex items-center gap-2">
							<Wallet />
							{t("home.connectWallet")}
						</div>
					)}
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onSelect={toggleTheme}>
					{theme === "light" ? <Sun /> : <Moon />}
					Theme
					<span className="ml-auto text-xs text-muted-foreground">
						{theme === "light" ? "Light" : "Dark"}
					</span>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<Settings />
					Settings
				</DropdownMenuItem>
				<DropdownMenuItem variant="destructive" onSelect={handleSignOut}>
					<LogOut />
					{t("home.signOut")}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default ProfileButton;
