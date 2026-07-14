"use client";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Skeleton } from "@repo/ui/components/skeleton";
import { Camera, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { env } from "@/env/client";
import { authClient, useSession } from "@/lib/auth-client";
import { getResponseErrorMessage } from "@/lib/http";

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = [
	"image/jpeg",
	"image/png",
	"image/gif",
	"image/webp",
];

export default function SettingsPage() {
	const router = useRouter();
	const { data: session, isPending, refetch } = useSession();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [name, setName] = useState<string | null>(null);
	const [isUpdatingName, setIsUpdatingName] = useState(false);
	const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

	useEffect(() => {
		if (!(isPending || session)) {
			router.replace("/auth/sign-in");
		}
	}, [isPending, router, session]);

	const currentName = name ?? session?.user.name ?? "";

	const handleUpdateName = async () => {
		const trimmedName = currentName.trim();
		if (!trimmedName) {
			toast.error("Name cannot be empty");
			return;
		}

		setIsUpdatingName(true);
		try {
			const { error } = await authClient.updateUser({ name: trimmedName });
			if (error) {
				toast.error(error.message || "Failed to update name");
				return;
			}

			await refetch();
			setName(null);
			toast.success("Name updated successfully");
		} catch {
			toast.error("Failed to update name");
		} finally {
			setIsUpdatingName(false);
		}
	};

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = event.target.files?.[0];
		if (!file) return;

		if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
			toast.error("Invalid file type. Allowed: JPEG, PNG, GIF, WebP");
			event.target.value = "";
			return;
		}
		if (file.size > MAX_AVATAR_SIZE) {
			toast.error("File too large. Maximum size is 5MB");
			event.target.value = "";
			return;
		}

		setIsUploadingAvatar(true);
		try {
			const formData = new FormData();
			formData.append("file", file);
			const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/upload/avatar`, {
				method: "POST",
				body: formData,
				credentials: "include",
			});

			if (!response.ok) {
				throw new Error(
					await getResponseErrorMessage(response, "Failed to upload avatar"),
				);
			}

			await refetch();
			router.refresh();
			toast.success("Avatar updated successfully");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to upload avatar",
			);
		} finally {
			setIsUploadingAvatar(false);
			event.target.value = "";
		}
	};

	if (isPending) {
		return (
			<div className="container max-w-2xl py-10">
				<Card>
					<CardHeader>
						<Skeleton className="h-8 w-48 motion-reduce:animate-none" />
						<Skeleton className="h-4 w-72 motion-reduce:animate-none" />
					</CardHeader>
					<CardContent className="space-y-6">
						<Skeleton className="mx-auto h-24 w-24 rounded-full motion-reduce:animate-none" />
						<Skeleton className="h-10 w-full motion-reduce:animate-none" />
						<Skeleton className="h-10 w-full motion-reduce:animate-none" />
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!session) return null;

	const avatarUrl = session.user.image ?? undefined;
	const fallbackLabel = (session.user.name || session.user.email || "")
		.charAt(0)
		.toUpperCase();

	return (
		<div className="container max-w-2xl py-10">
			<Card>
				<CardHeader>
					<CardTitle>Profile Settings</CardTitle>
					<CardDescription>
						Manage your profile information and avatar
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-8">
					<div className="flex flex-col items-center gap-4">
						<div className="group relative">
							<Avatar className="h-24 w-24">
								<AvatarImage
									alt={session.user.name || "Profile avatar"}
									className="object-cover"
									src={avatarUrl}
								/>
								<AvatarFallback className="bg-primary text-2xl text-primary-foreground">
									{fallbackLabel}
								</AvatarFallback>
							</Avatar>
							<button
								aria-busy={isUploadingAvatar}
								aria-controls="avatar-file"
								aria-label="Upload a new profile image"
								className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed group-hover:opacity-100"
								disabled={isUploadingAvatar}
								onClick={() => fileInputRef.current?.click()}
								type="button"
							>
								{isUploadingAvatar ? (
									<Loader2 className="h-6 w-6 animate-spin text-white motion-reduce:animate-none" />
								) : (
									<Camera className="h-6 w-6 text-white" />
								)}
							</button>
							<input
								accept="image/jpeg,image/png,image/gif,image/webp"
								className="hidden"
								id="avatar-file"
								name="avatar"
								onChange={handleFileChange}
								ref={fileInputRef}
								type="file"
							/>
						</div>
						<p className="text-muted-foreground text-sm">
							Select the avatar to upload a new image
						</p>
					</div>

					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Display Name</Label>
							<Input
								autoComplete="name"
								id="name"
								name="name"
								onChange={(event) => setName(event.target.value)}
								value={currentName}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								autoComplete="email"
								className="bg-muted"
								disabled
								id="email"
								name="email"
								type="email"
								value={session.user.email}
							/>
							<p className="text-muted-foreground text-xs">
								Email cannot be changed
							</p>
						</div>

						<Button
							className="w-full"
							disabled={
								isUpdatingName ||
								!currentName.trim() ||
								currentName.trim() === session.user.name
							}
							onClick={handleUpdateName}
							type="button"
						>
							{isUpdatingName ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin motion-reduce:animate-none" />
									Saving…
								</>
							) : (
								<>
									<Save className="mr-2 h-4 w-4" />
									Save Changes
								</>
							)}
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
