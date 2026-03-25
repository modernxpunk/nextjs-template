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
import { useRef, useState } from "react";
import { toast } from "sonner";
import { env } from "@/env/client";
import { authClient, useSession } from "@/lib/auth-client";

export default function SettingsPage() {
	const router = useRouter();
	const { data: session, isPending, refetch } = useSession();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [name, setName] = useState("");
	const [isUpdatingName, setIsUpdatingName] = useState(false);
	const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

	// Initialize name from session when it loads
	useState(() => {
		if (session?.user?.name) {
			setName(session.user.name);
		}
	});

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
	};

	const handleUpdateName = async () => {
		if (!name.trim()) {
			toast.error("Name cannot be empty");
			return;
		}

		setIsUpdatingName(true);
		try {
			const { error } = await authClient.updateUser({
				name: name.trim(),
			});

			if (error) {
				toast.error(error.message || "Failed to update name");
				return;
			}

			await refetch();
			toast.success("Name updated successfully");
		} catch {
			toast.error("Failed to update name");
		} finally {
			setIsUpdatingName(false);
		}
	};

	const handleAvatarClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file type
		const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
		if (!allowedTypes.includes(file.type)) {
			toast.error("Invalid file type. Allowed: JPEG, PNG, GIF, WebP");
			return;
		}

		// Validate file size (5MB)
		if (file.size > 5 * 1024 * 1024) {
			toast.error("File too large. Maximum size is 5MB");
			return;
		}

		setIsUploadingAvatar(true);
		try {
			const formData = new FormData();
			formData.append("file", file);

			const response = await fetch(`${env.PUBLIC_API_URL}/upload/avatar`, {
				method: "POST",
				body: formData,
				credentials: "include",
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || "Failed to upload avatar");
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
			// Reset file input
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		}
	};

	if (isPending) {
		return (
			<div className="container max-w-2xl py-10">
				<Card>
					<CardHeader>
						<Skeleton className="h-8 w-48" />
						<Skeleton className="h-4 w-72" />
					</CardHeader>
					<CardContent className="space-y-6">
						<Skeleton className="h-24 w-24 rounded-full mx-auto" />
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!session) {
		router.push("/auth/sign-in");
		return null;
	}

	const avatarUrl = session.user.image ?? undefined;
	const fallbackLabel = (session.user.name || session.user.email || "")
		.charAt(0)
		.toUpperCase();
	const currentName = name || session.user.name || "";

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
					{/* Avatar Section */}
					<div className="flex flex-col items-center gap-4">
						<div className="relative group">
							<Avatar className="h-24 w-24">
								<AvatarImage className="object-cover" src={avatarUrl} />
								<AvatarFallback className="bg-primary text-primary-foreground text-2xl">
									{fallbackLabel}
								</AvatarFallback>
							</Avatar>
							<button
								type="button"
								onClick={handleAvatarClick}
								disabled={isUploadingAvatar}
								className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-not-allowed"
							>
								{isUploadingAvatar ? (
									<Loader2 className="h-6 w-6 text-white animate-spin" />
								) : (
									<Camera className="h-6 w-6 text-white" />
								)}
							</button>
							<input
								ref={fileInputRef}
								type="file"
								accept="image/jpeg,image/png,image/gif,image/webp"
								onChange={handleFileChange}
								className="hidden"
							/>
						</div>
						<p className="text-sm text-muted-foreground">
							Click on avatar to upload a new image
						</p>
					</div>

					{/* Name Section */}
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Display Name</Label>
							<Input
								id="name"
								value={currentName}
								onChange={handleNameChange}
								placeholder="Enter your name"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								value={session.user.email}
								disabled
								className="bg-muted"
							/>
							<p className="text-xs text-muted-foreground">
								Email cannot be changed
							</p>
						</div>

						<Button
							onClick={handleUpdateName}
							disabled={isUpdatingName || currentName === session.user.name}
							className="w-full"
						>
							{isUpdatingName ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Saving...
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
