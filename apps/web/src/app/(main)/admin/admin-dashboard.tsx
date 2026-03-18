"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Calendar } from "@repo/ui/components/calendar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@repo/ui/components/collapsible";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@repo/ui/components/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@repo/ui/components/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@repo/ui/components/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@repo/ui/components/table";
import {
	CalendarIcon,
	CheckCircle2,
	Loader2,
	MoreHorizontal,
	Search,
	SlidersHorizontal,
	XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type {
	SessionWithImpersonatedBy,
	UserWithRole,
} from "better-auth/client/plugins";
import { authClient, useSession } from "@/lib/auth-client";
import {
	getPrimaryRole,
	isAdminRole,
	normalizeRoles,
	type RoleValue,
} from "@/lib/auth-roles";

const APP_ROLES = ["user", "admin", "support"] as const;
const SEARCH_FIELDS = ["email", "name"] as const;
const SORT_FIELDS = ["createdAt", "updatedAt", "name", "email"] as const;
const SORT_DIRECTIONS = ["asc", "desc"] as const;
const PAGE_SIZES = [10, 20, 50] as const;
const BANNED_FILTERS = ["all", "active", "banned"] as const;
const DEFAULT_BAN_REASON = "Policy violation";
const DEFAULT_BAN_EXPIRES_IN = 604800;

type AppRole = (typeof APP_ROLES)[number];
type SearchField = (typeof SEARCH_FIELDS)[number];
type SortField = (typeof SORT_FIELDS)[number];
type SortDirection = (typeof SORT_DIRECTIONS)[number];
type BannedFilter = (typeof BANNED_FILTERS)[number];

type AdminUser = Omit<UserWithRole, "role" | "createdAt" | "updatedAt" | "banExpires"> & {
	role?: RoleValue;
	createdAt?: string | Date | null;
	updatedAt?: string | Date | null;
	banExpires?: string | Date | null;
};

type AdminSession = Omit<
	SessionWithImpersonatedBy,
	"createdAt" | "updatedAt" | "expiresAt"
> & {
	createdAt?: string | Date | null;
	updatedAt?: string | Date | null;
	expiresAt?: string | Date | null;
};

type ListUsersState = {
	searchValue: string;
	searchField: SearchField;
	filterRole: AppRole | "all";
	filterBanned: BannedFilter;
	sortBy: SortField;
	sortDirection: SortDirection;
	limit: number;
	offset: number;
};

type CreateUserState = {
	name: string;
	email: string;
	password: string;
	role: AppRole;
};

type BanModalState = {
	open: boolean;
	user: AdminUser | null;
	reason: string;
	expiresAt: Date;
};

type SessionsModalState = {
	open: boolean;
	userId: string | null;
	sessions: AdminSession[];
	isLoading: boolean;
};

type Feedback = {
	type: "success" | "error";
	message: string;
} | null;

type ApiResult<T> = {
	data?: T | null;
	error?: {
		message?: string;
	} | null;
};

type ListUsersResponse = {
	users: AdminUser[];
	total: number;
};

type ListUserSessionsResponse = {
	sessions: AdminSession[];
};

type ListUsersParams = NonNullable<Parameters<typeof authClient.admin.listUsers>[0]>;
type ListUsersQuery = NonNullable<ListUsersParams["query"]>;
type PermissionInput = Parameters<
	typeof authClient.admin.checkRolePermission
>[0]["permissions"];

type AbilityGroup = {
	title: string;
	labels: string[];
};

const DEFAULT_LIST_USERS_STATE: ListUsersState = {
	searchValue: "",
	searchField: "email",
	filterRole: "all",
	filterBanned: "all",
	sortBy: "createdAt",
	sortDirection: "desc",
	limit: 20,
	offset: 0,
};

const DEFAULT_CREATE_USER_STATE: CreateUserState = {
	name: "",
	email: "",
	password: "",
	role: "user",
};

const PERMISSION_CHECKS: Array<{ label: string; permissions: PermissionInput }> = [
	{ label: "user.create", permissions: { user: ["create"] } },
	{ label: "user.list", permissions: { user: ["list"] } },
	{ label: "user.get", permissions: { user: ["get"] } },
	{ label: "user.set-role", permissions: { user: ["set-role"] } },
	{ label: "user.ban", permissions: { user: ["ban"] } },
	{ label: "user.impersonate", permissions: { user: ["impersonate"] } },
	{ label: "user.delete", permissions: { user: ["delete"] } },
	{ label: "session.list", permissions: { session: ["list"] } },
	{ label: "session.revoke", permissions: { session: ["revoke"] } },
	{ label: "project.read", permissions: { project: ["read"] } },
	{ label: "project.create", permissions: { project: ["create"] } },
	{ label: "project.update", permissions: { project: ["update"] } },
	{ label: "project.delete", permissions: { project: ["delete"] } },
];

const ABILITY_GROUPS: AbilityGroup[] = [
	{
		title: "User Management",
		labels: [
			"user.create",
			"user.list",
			"user.get",
			"user.set-role",
			"user.ban",
			"user.impersonate",
			"user.delete",
		],
	},
	{
		title: "Sessions",
		labels: ["session.list", "session.revoke"],
	},
	{
		title: "Projects",
		labels: ["project.read", "project.create", "project.update", "project.delete"],
	},
];

const isAppRole = (role: string): role is AppRole => {
	return APP_ROLES.includes(role as AppRole);
};

const toDateLabel = (value: string | Date | null | undefined): string => {
	if (!value) {
		return "n/a";
	}

	const date = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(date.getTime())) {
		return "n/a";
	}

	return date.toLocaleString();
};

const toDayLabel = (date: Date): string => {
	return date.toLocaleDateString(undefined, {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};

const toTimeValue = (date: Date): string => {
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	return `${hours}:${minutes}`;
};

const compactToken = (token: string): string => {
	if (token.length < 16) {
		return token;
	}

	return `${token.slice(0, 8)}...${token.slice(-6)}`;
};

const getErrorMessage = (error: unknown, fallback: string): string => {
	if (
		typeof error === "object" &&
		error !== null &&
		"message" in error &&
		typeof error.message === "string" &&
		error.message
	) {
		return error.message;
	}

	return fallback;
};

const ensureData = <T,>(result: ApiResult<T>, fallback: string): T => {
	if (result.error?.message) {
		throw new Error(result.error.message);
	}
	if (result.data === undefined || result.data === null) {
		throw new Error(fallback);
	}

	return result.data;
};

const buildUsersQuery = (state: ListUsersState): ListUsersQuery => {
	const query: ListUsersQuery = {
		limit: state.limit,
		offset: state.offset,
		sortBy: state.sortBy,
		sortDirection: state.sortDirection,
	};

	const search = state.searchValue.trim();
	if (search) {
		query.searchField = state.searchField;
		query.searchOperator = "contains";
		query.searchValue = search;
	}

	if (state.filterRole !== "all") {
		query.filterField = "role";
		query.filterOperator = "eq";
		query.filterValue = state.filterRole;
	} else if (state.filterBanned !== "all") {
		query.filterField = "banned";
		query.filterOperator = "eq";
		query.filterValue = state.filterBanned === "banned";
	}

	return query;
};

const getDefaultBanDate = (): Date => {
	return new Date(Date.now() + DEFAULT_BAN_EXPIRES_IN * 1000);
};

const getDefaultBanModalState = (): BanModalState => {
	return {
		open: false,
		user: null,
		reason: DEFAULT_BAN_REASON,
		expiresAt: getDefaultBanDate(),
	};
};

const AdminDashboard = () => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { data: session, isPending: isSessionPending, refetch } = useSession();

	const [filters, setFilters] = useState<ListUsersState>(DEFAULT_LIST_USERS_STATE);
	const [queryState, setQueryState] = useState<ListUsersState>(DEFAULT_LIST_USERS_STATE);
	const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
	const [createUserOpen, setCreateUserOpen] = useState(false);
	const [createUserState, setCreateUserState] = useState<CreateUserState>(
		DEFAULT_CREATE_USER_STATE,
	);
	const [roleDraftByUserId, setRoleDraftByUserId] = useState<Record<string, AppRole>>({});
	const [pendingActionId, setPendingActionId] = useState<string | null>(null);
	const [feedback, setFeedback] = useState<Feedback>(null);
	const [banModal, setBanModal] = useState<BanModalState>(getDefaultBanModalState);
	const [sessionsModal, setSessionsModal] = useState<SessionsModalState>({
		open: false,
		userId: null,
		sessions: [],
		isLoading: false,
	});

	const usersQuery = useQuery<ListUsersResponse>({
		queryKey: ["admin-users", queryState],
		queryFn: async () => {
			const result = await authClient.admin.listUsers({
				query: buildUsersQuery(queryState),
			});

			return ensureData<ListUsersResponse>(result, "Unable to load users.");
		},
	});

	const currentRole = useMemo<AppRole>(() => {
		const role = getPrimaryRole(session?.user.role);
		return isAppRole(role) ? role : "user";
	}, [session?.user.role]);

	const users = usersQuery.data?.users ?? [];
	const totalUsers = usersQuery.data?.total ?? 0;
	const totalPages = Math.max(1, Math.ceil(totalUsers / queryState.limit));
	const currentPage = Math.floor(queryState.offset / queryState.limit) + 1;
	const isAuthenticatedAdmin = isAdminRole(session?.user.role);
	const isImpersonating = Boolean(session?.session.impersonatedBy);

	const canCreateUsers = authClient.admin.checkRolePermission({
		role: currentRole,
		permissions: { user: ["create"] },
	});
	const canSetRole = authClient.admin.checkRolePermission({
		role: currentRole,
		permissions: { user: ["set-role"] },
	});
	const canBanUsers = authClient.admin.checkRolePermission({
		role: currentRole,
		permissions: { user: ["ban"] },
	});
	const canRevokeSessions = authClient.admin.checkRolePermission({
		role: currentRole,
		permissions: { session: ["revoke"] },
	});
	const canImpersonateUsers = authClient.admin.checkRolePermission({
		role: currentRole,
		permissions: { user: ["impersonate"] },
	});
	const canDeleteUsers = authClient.admin.checkRolePermission({
		role: currentRole,
		permissions: { user: ["delete"] },
	});

	const allowedPermissions = PERMISSION_CHECKS.filter((item) =>
		authClient.admin.checkRolePermission({
			role: currentRole,
			permissions: item.permissions,
		}),
	);
	const allowedSet = new Set(allowedPermissions.map((item) => item.label));
	const deniedPermissionsCount = PERMISSION_CHECKS.length - allowedPermissions.length;

	const activeFilterBadges: string[] = [];
	if (filters.searchValue.trim()) {
		activeFilterBadges.push(`search: ${filters.searchField}`);
	}
	if (filters.filterRole !== "all") {
		activeFilterBadges.push(`role=${filters.filterRole}`);
	}
	if (filters.filterBanned !== "all") {
		activeFilterBadges.push(`banned=${filters.filterBanned}`);
	}
	if (filters.sortBy !== DEFAULT_LIST_USERS_STATE.sortBy) {
		activeFilterBadges.push(`sort=${filters.sortBy}`);
	}
	if (filters.sortDirection !== DEFAULT_LIST_USERS_STATE.sortDirection) {
		activeFilterBadges.push(`direction=${filters.sortDirection}`);
	}
	if (filters.limit !== DEFAULT_LIST_USERS_STATE.limit) {
		activeFilterBadges.push(`page size=${filters.limit}`);
	}

	const refreshUsers = async () => {
		await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
	};

	const runAction = async (
		actionId: string,
		successMessage: string,
		action: () => Promise<void>,
	) => {
		setPendingActionId(actionId);
		setFeedback(null);
		try {
			await action();
			setFeedback({ type: "success", message: successMessage });
		} catch (error) {
			setFeedback({
				type: "error",
				message: getErrorMessage(error, "Admin action failed."),
			});
		} finally {
			setPendingActionId(null);
		}
	};

	const fetchUserSessions = async (userId: string, open = true) => {
		setSessionsModal((prev) => ({
			open,
			userId,
			sessions: prev.userId === userId ? prev.sessions : [],
			isLoading: true,
		}));
		setFeedback(null);

		try {
			const result = await authClient.admin.listUserSessions({ userId });
			const data = ensureData<ListUserSessionsResponse>(
				result,
				"Unable to load user sessions.",
			);
			setSessionsModal({
				open,
				userId,
				sessions: data.sessions,
				isLoading: false,
			});
		} catch (error) {
			setSessionsModal((prev) => ({ ...prev, open, userId, sessions: [], isLoading: false }));
			setFeedback({
				type: "error",
				message: getErrorMessage(error, "Unable to load user sessions."),
			});
		}
	};

	const applyFilters = () => {
		setQueryState((prev) => ({ ...filters, offset: 0, limit: filters.limit || prev.limit }));
	};

	const resetFilters = () => {
		setFilters(DEFAULT_LIST_USERS_STATE);
		setQueryState(DEFAULT_LIST_USERS_STATE);
		setShowAdvancedFilters(false);
	};

	const createUser = async () => {
		if (
			!createUserState.name.trim() ||
			!createUserState.email.trim() ||
			!createUserState.password.trim()
		) {
			setFeedback({
				type: "error",
				message: "Name, email and password are required.",
			});
			return;
		}

		await runAction("create-user", "User created successfully.", async () => {
			const result = await authClient.admin.createUser({
				name: createUserState.name.trim(),
				email: createUserState.email.trim(),
				password: createUserState.password,
				role: createUserState.role,
			});
			ensureData(result, "Create user failed.");
			setCreateUserState(DEFAULT_CREATE_USER_STATE);
			setCreateUserOpen(false);
			await refreshUsers();
		});
	};

	const setRole = async (user: AdminUser) => {
		const fallback = getPrimaryRole(user.role);
		const role = roleDraftByUserId[user.id] ?? (isAppRole(fallback) ? fallback : "user");

		await runAction(`set-role-${user.id}`, "User role updated.", async () => {
			const result = await authClient.admin.setRole({ userId: user.id, role });
			ensureData(result, "Set role failed.");
			await refreshUsers();
			if (session?.user.id === user.id) {
				await refetch();
				router.refresh();
			}
		});
	};

	const openBanModal = (user: AdminUser) => {
		setBanModal({
			open: true,
			user,
			reason: DEFAULT_BAN_REASON,
			expiresAt: getDefaultBanDate(),
		});
	};

	const closeBanModal = () => {
		setBanModal(getDefaultBanModalState());
	};

	const confirmBanUser = async () => {
		const user = banModal.user;
		if (!user) {
			return;
		}

		const expiresIn = Math.floor((banModal.expiresAt.getTime() - Date.now()) / 1000);
		if (!Number.isFinite(expiresIn) || expiresIn <= 0) {
			setFeedback({
				type: "error",
				message: "Ban end date must be in the future.",
			});
			return;
		}

		await runAction(`ban-user-${user.id}`, "User banned.", async () => {
			const result = await authClient.admin.banUser({
				userId: user.id,
				banReason: banModal.reason.trim() || undefined,
				banExpiresIn: expiresIn,
			});
			ensureData(result, "Ban user failed.");
			closeBanModal();
			await refreshUsers();
		});
	};

	const unbanUser = async (user: AdminUser) => {
		await runAction(`unban-user-${user.id}`, "User unbanned.", async () => {
			const result = await authClient.admin.unbanUser({ userId: user.id });
			ensureData(result, "Unban user failed.");
			await refreshUsers();
		});
	};

	const revokeAllSessions = async (userId: string) => {
		await runAction(`revoke-all-${userId}`, "All user sessions revoked.", async () => {
			const result = await authClient.admin.revokeUserSessions({ userId });
			ensureData(result, "Revoke user sessions failed.");
			if (sessionsModal.open && sessionsModal.userId === userId) {
				await fetchUserSessions(userId, true);
			}
		});
	};

	const revokeSession = async (sessionToken: string) => {
		const userId = sessionsModal.userId;
		if (!userId) {
			return;
		}

		await runAction(`revoke-${sessionToken}`, "User session revoked.", async () => {
			const result = await authClient.admin.revokeUserSession({ sessionToken });
			ensureData(result, "Revoke user session failed.");
			await fetchUserSessions(userId, true);
		});
	};

	const impersonateUser = async (userId: string) => {
		await runAction("impersonate-user", "Impersonation started.", async () => {
			const result = await authClient.admin.impersonateUser({ userId });
			ensureData(result, "Impersonation failed.");
			await refetch();
			router.refresh();
		});
	};

	const stopImpersonating = async () => {
		await runAction("stop-impersonating", "Returned to admin session.", async () => {
			const result = await authClient.admin.stopImpersonating();
			ensureData(result, "Stop impersonation failed.");
			await refetch();
			router.refresh();
		});
	};

	const removeUser = async (user: AdminUser) => {
		const confirmed = window.confirm(`Delete ${user.email}? This action is permanent.`);
		if (!confirmed) {
			return;
		}

		await runAction(`remove-${user.id}`, "User removed.", async () => {
			const result = await authClient.admin.removeUser({ userId: user.id });
			ensureData(result, "Remove user failed.");
			await refreshUsers();
			if (sessionsModal.userId === user.id) {
				setSessionsModal((prev) => ({ ...prev, open: false }));
			}
		});
	};

	if (isSessionPending) {
		return (
			<div className="container py-10">
				<div className="flex items-center gap-2 text-muted-foreground text-sm">
					<Loader2 className="size-4 animate-spin" />
					Loading admin session...
				</div>
			</div>
		);
	}

	if (!isAuthenticatedAdmin) {
		return (
			<div className="container py-10">
				<Card>
					<CardHeader>
						<CardTitle>Admin access required</CardTitle>
						<CardDescription>
							Only users with the `admin` role can access this page.
						</CardDescription>
					</CardHeader>
				</Card>
			</div>
		);
	}

	return (
		<div className="container space-y-6 py-6">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h1 className="font-semibold text-3xl">Admin Dashboard</h1>
					<p className="text-muted-foreground text-sm">
						Single-file admin panel powered by Better Auth.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button
						disabled={pendingActionId !== null || !canCreateUsers}
						onClick={() => setCreateUserOpen(true)}
					>
						Create user
					</Button>
					{isImpersonating ? (
						<Button
							disabled={pendingActionId !== null}
							onClick={() => void stopImpersonating()}
							variant="outline"
						>
							Stop impersonating
						</Button>
					) : null}
				</div>
			</div>

			{feedback ? (
				<div
					className={
						feedback.type === "success"
							? "rounded-md border border-emerald-600/30 bg-emerald-500/10 px-3 py-2 text-emerald-700 text-sm"
							: "rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-destructive text-sm"
					}
				>
					{feedback.message}
				</div>
			) : null}

			<Card>
				<CardHeader>
					<CardTitle>Role Abilities</CardTitle>
					<CardDescription>
						Current role: <span className="font-medium">{currentRole}</span>
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex flex-wrap items-center gap-2">
						<Badge variant="secondary">{`Allowed ${allowedPermissions.length}`}</Badge>
						<Badge variant="outline">{`Denied ${deniedPermissionsCount}`}</Badge>
						{isImpersonating ? <Badge variant="destructive">Impersonating</Badge> : null}
					</div>
					<div className="grid gap-3 md:grid-cols-3">
						{ABILITY_GROUPS.map((group) => {
							const allowedInGroup = group.labels.filter((label) => allowedSet.has(label));
							return (
								<div className="rounded-lg border p-3" key={group.title}>
									<div className="mb-2 flex items-center justify-between">
										<p className="font-medium text-sm">{group.title}</p>
										<Badge variant="secondary">{`${allowedInGroup.length}/${group.labels.length}`}</Badge>
									</div>
									<div className="space-y-2">
										{group.labels.map((label) => {
											const allowed = allowedSet.has(label);
											return (
												<div className="flex items-center justify-between" key={label}>
													<span className="text-sm">{label}</span>
													{allowed ? (
														<CheckCircle2 className="size-4 text-emerald-600" />
													) : (
														<XCircle className="size-4 text-muted-foreground" />
													)}
												</div>
											);
										})}
									</div>
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>User Directory</CardTitle>
					<CardDescription>
						Use quick search for speed and open advanced filters only when needed.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<form
						className="space-y-4"
						onSubmit={(event) => {
							event.preventDefault();
							applyFilters();
						}}
					>
						<div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_auto_auto]">
							<div className="space-y-2">
								<Label htmlFor="search">Search users</Label>
								<div className="relative">
									<Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
									<Input
										id="search"
										className="pl-9"
										placeholder="Type name or email"
										value={filters.searchValue}
										onChange={(event) =>
											setFilters((prev) => ({ ...prev, searchValue: event.target.value }))
										}
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label>Search in</Label>
								<Select
									value={filters.searchField}
									onValueChange={(value) =>
										setFilters((prev) => ({ ...prev, searchField: value as SearchField }))
									}
								>
									<SelectTrigger className="w-full">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{SEARCH_FIELDS.map((field) => (
											<SelectItem key={field} value={field}>
												{field}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="flex items-end">
								<Button className="w-full md:w-auto" disabled={pendingActionId !== null} type="submit">
									Apply
								</Button>
							</div>

							<div className="flex items-end">
								<Button
									className="w-full md:w-auto"
									disabled={pendingActionId !== null}
									type="button"
									variant="outline"
									onClick={resetFilters}
								>
									Reset
								</Button>
							</div>
						</div>

						<Collapsible
							className="space-y-3"
							onOpenChange={setShowAdvancedFilters}
							open={showAdvancedFilters}
						>
							<div className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-3">
								<div className="flex flex-wrap items-center gap-2">
									{activeFilterBadges.length === 0 ? (
										<span className="text-muted-foreground text-sm">No active filters</span>
									) : (
										activeFilterBadges.map((item) => (
											<Badge key={item} variant="outline">
												{item}
											</Badge>
										))
									)}
								</div>
								<CollapsibleTrigger asChild>
									<Button size="sm" type="button" variant="outline">
										<SlidersHorizontal className="size-4" />
										{showAdvancedFilters ? "Hide Advanced" : "Show Advanced"}
									</Button>
								</CollapsibleTrigger>
							</div>

							<CollapsibleContent className="grid gap-3 rounded-md border p-3 md:grid-cols-5">
								<div className="space-y-2">
									<Label>Role</Label>
									<Select
										value={filters.filterRole}
										onValueChange={(value) =>
											setFilters((prev) => ({
												...prev,
												filterRole: value as AppRole | "all",
											}))
										}
									>
										<SelectTrigger className="w-full">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="all">all</SelectItem>
											{APP_ROLES.map((role) => (
												<SelectItem key={role} value={role}>
													{role}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label>Banned</Label>
									<Select
										value={filters.filterBanned}
										onValueChange={(value) =>
											setFilters((prev) => ({ ...prev, filterBanned: value as BannedFilter }))
										}
									>
										<SelectTrigger className="w-full">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{BANNED_FILTERS.map((option) => (
												<SelectItem key={option} value={option}>
													{option}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label>Sort by</Label>
									<Select
										value={filters.sortBy}
										onValueChange={(value) =>
											setFilters((prev) => ({ ...prev, sortBy: value as SortField }))
										}
									>
										<SelectTrigger className="w-full">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{SORT_FIELDS.map((field) => (
												<SelectItem key={field} value={field}>
													{field}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label>Direction</Label>
									<Select
										value={filters.sortDirection}
										onValueChange={(value) =>
											setFilters((prev) => ({ ...prev, sortDirection: value as SortDirection }))
										}
									>
										<SelectTrigger className="w-full">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{SORT_DIRECTIONS.map((direction) => (
												<SelectItem key={direction} value={direction}>
													{direction}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label>Page size</Label>
									<Select
										value={String(filters.limit)}
										onValueChange={(value) =>
											setFilters((prev) => ({ ...prev, limit: Number(value) }))
										}
									>
										<SelectTrigger className="w-full">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{PAGE_SIZES.map((size) => (
												<SelectItem key={size} value={String(size)}>
													{size}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</CollapsibleContent>
						</Collapsible>
					</form>

					<div className="overflow-x-auto rounded-lg border">
						<div className="min-w-[980px]">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>User</TableHead>
										<TableHead>Role</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Ban Expires</TableHead>
										<TableHead>Created</TableHead>
										<TableHead>Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{usersQuery.isPending ? (
										<TableRow>
											<TableCell className="text-muted-foreground" colSpan={6}>
												<div className="flex items-center gap-2">
													<Loader2 className="size-4 animate-spin" />
													Loading users...
												</div>
											</TableCell>
										</TableRow>
									) : null}
									{usersQuery.error ? (
										<TableRow>
											<TableCell className="text-destructive" colSpan={6}>
												Unable to load users.
											</TableCell>
										</TableRow>
									) : null}
									{!usersQuery.isPending && !usersQuery.error && users.length === 0 ? (
										<TableRow>
											<TableCell className="text-muted-foreground" colSpan={6}>
												No users found.
											</TableCell>
										</TableRow>
									) : null}
									{users.map((user) => {
										const fallback = getPrimaryRole(user.role);
										const selectedRole =
											roleDraftByUserId[user.id] ?? (isAppRole(fallback) ? fallback : "user");
										const rolesLabel = normalizeRoles(user.role).join(", ") || "user";

										return (
											<TableRow key={user.id}>
												<TableCell className="max-w-[280px] whitespace-normal">
													<div className="font-medium">{user.name}</div>
													<div className="text-muted-foreground text-xs">{user.email}</div>
													<div className="text-muted-foreground text-xs">{user.id}</div>
												</TableCell>
												<TableCell>
													<div className="space-y-2">
														<Badge variant="secondary">{rolesLabel}</Badge>
														<div className="flex items-center gap-2">
															<Select
																value={selectedRole}
																onValueChange={(value) => {
																	if (!isAppRole(value)) {
																		return;
																	}
																	setRoleDraftByUserId((prev) => ({ ...prev, [user.id]: value }));
																}}
															>
																<SelectTrigger className="w-[120px]">
																	<SelectValue />
																</SelectTrigger>
																<SelectContent>
																	{APP_ROLES.map((role) => (
																		<SelectItem key={role} value={role}>
																			{role}
																		</SelectItem>
																	))}
																</SelectContent>
															</Select>
															<Button
																size="sm"
																variant="outline"
																disabled={pendingActionId !== null || !canSetRole}
																onClick={() => void setRole(user)}
															>
																Save
															</Button>
														</div>
													</div>
												</TableCell>
												<TableCell>
													<Badge variant={user.banned ? "destructive" : "outline"}>
														{user.banned ? "banned" : "active"}
													</Badge>
												</TableCell>
												<TableCell>{toDateLabel(user.banExpires)}</TableCell>
												<TableCell>{toDateLabel(user.createdAt)}</TableCell>
												<TableCell>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																size="sm"
																variant="outline"
																disabled={pendingActionId !== null}
															>
																Actions
																<MoreHorizontal className="size-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end">
															<DropdownMenuItem onSelect={() => void fetchUserSessions(user.id, true)}>
																View sessions...
																<span className="ml-auto text-muted-foreground text-xs">modal</span>
															</DropdownMenuItem>
															<DropdownMenuItem
																disabled={!canRevokeSessions}
																onSelect={() => void revokeAllSessions(user.id)}
															>
																Revoke all sessions
															</DropdownMenuItem>
															<DropdownMenuSeparator />
															{user.banned ? (
																<DropdownMenuItem
																	disabled={!canBanUsers}
																	onSelect={() => void unbanUser(user)}
																>
																	Unban user
																</DropdownMenuItem>
															) : (
																<DropdownMenuItem
																	disabled={!canBanUsers}
																	onSelect={() => openBanModal(user)}
																>
																	Ban user...
																	<span className="ml-auto text-muted-foreground text-xs">modal</span>
																</DropdownMenuItem>
															)}
															<DropdownMenuItem
																disabled={!canImpersonateUsers}
																onSelect={() => void impersonateUser(user.id)}
															>
																Impersonate user
															</DropdownMenuItem>
															<DropdownMenuSeparator />
															<DropdownMenuItem
																disabled={!canDeleteUsers}
																onSelect={() => void removeUser(user)}
																variant="destructive"
															>
																Remove user
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</div>
					</div>

					<div className="flex items-center justify-between gap-2">
						<p className="text-muted-foreground text-sm">
							Page {currentPage} of {totalPages} ({totalUsers} users)
						</p>
						<div className="flex items-center gap-2">
							<Button
								size="sm"
								variant="outline"
								disabled={queryState.offset <= 0}
								onClick={() =>
									setQueryState((prev) => ({
										...prev,
										offset: Math.max(0, prev.offset - prev.limit),
									}))
								}
							>
								Previous
							</Button>
							<Button
								size="sm"
								variant="outline"
								disabled={queryState.offset + queryState.limit >= totalUsers}
								onClick={() =>
									setQueryState((prev) => ({ ...prev, offset: prev.offset + prev.limit }))
								}
							>
								Next
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			<Dialog onOpenChange={setCreateUserOpen} open={createUserOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create User</DialogTitle>
						<DialogDescription>Create a new user via admin API.</DialogDescription>
					</DialogHeader>
					<div className="grid gap-3">
						<div className="space-y-2">
							<Label htmlFor="create-name">Name</Label>
							<Input
								id="create-name"
								value={createUserState.name}
								onChange={(event) =>
									setCreateUserState((prev) => ({ ...prev, name: event.target.value }))
								}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="create-email">Email</Label>
							<Input
								id="create-email"
								type="email"
								value={createUserState.email}
								onChange={(event) =>
									setCreateUserState((prev) => ({ ...prev, email: event.target.value }))
								}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="create-password">Password</Label>
							<Input
								id="create-password"
								type="password"
								value={createUserState.password}
								onChange={(event) =>
									setCreateUserState((prev) => ({ ...prev, password: event.target.value }))
								}
							/>
						</div>
						<div className="space-y-2">
							<Label>Role</Label>
							<Select
								value={createUserState.role}
								onValueChange={(value) => {
									if (!isAppRole(value)) {
										return;
									}
									setCreateUserState((prev) => ({ ...prev, role: value }));
								}}
							>
								<SelectTrigger className="w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{APP_ROLES.map((role) => (
										<SelectItem key={role} value={role}>
											{role}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
					<DialogFooter>
						<Button onClick={() => setCreateUserOpen(false)} type="button" variant="outline">
							Cancel
						</Button>
						<Button
							disabled={pendingActionId !== null || !canCreateUsers}
							onClick={() => void createUser()}
							type="button"
						>
							Create user
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog
				onOpenChange={(open) => {
					if (!open) {
						closeBanModal();
						return;
					}
					setBanModal((prev) => ({ ...prev, open: true }));
				}}
				open={banModal.open}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Ban User</DialogTitle>
						<DialogDescription>
							{banModal.user
								? `Ban ${banModal.user.email}. Reason and end date are pre-filled.`
								: "Ban selected user."}
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-3">
						<div className="space-y-2">
							<Label htmlFor="ban-reason">Reason</Label>
							<Input
								id="ban-reason"
								value={banModal.reason}
								onChange={(event) =>
									setBanModal((prev) => ({ ...prev, reason: event.target.value }))
								}
							/>
						</div>
						<div className="grid gap-3 md:grid-cols-[1fr_140px]">
							<div className="space-y-2">
								<Label>Ban until (date)</Label>
								<Popover>
									<PopoverTrigger asChild>
										<Button className="w-full justify-between" type="button" variant="outline">
											<span>{toDayLabel(banModal.expiresAt)}</span>
											<CalendarIcon className="size-4 text-muted-foreground" />
										</Button>
									</PopoverTrigger>
									<PopoverContent align="start" className="w-auto p-0">
										<Calendar
											mode="single"
											selected={banModal.expiresAt}
											onSelect={(nextDate) => {
												if (!nextDate) {
													return;
												}
												setBanModal((prev) => {
													const merged = new Date(nextDate);
													merged.setHours(
														prev.expiresAt.getHours(),
														prev.expiresAt.getMinutes(),
														0,
														0,
													);
													return { ...prev, expiresAt: merged };
												});
											}}
										/>
									</PopoverContent>
								</Popover>
							</div>
							<div className="space-y-2">
								<Label htmlFor="ban-time">Time</Label>
								<Input
									id="ban-time"
									type="time"
									value={toTimeValue(banModal.expiresAt)}
									onChange={(event) => {
										const [hoursRaw, minutesRaw] = event.target.value.split(":");
										const hours = Number(hoursRaw);
										const minutes = Number(minutesRaw);
										if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
											return;
										}
										setBanModal((prev) => {
											const nextDate = new Date(prev.expiresAt);
											nextDate.setHours(hours, minutes, 0, 0);
											return { ...prev, expiresAt: nextDate };
										});
									}}
								/>
							</div>
						</div>
						<p className="text-muted-foreground text-xs">
							Default horizon: {Math.floor(DEFAULT_BAN_EXPIRES_IN / 86400)} days.
						</p>
					</div>
					<DialogFooter>
						<Button onClick={closeBanModal} type="button" variant="outline">
							Cancel
						</Button>
						<Button
							disabled={pendingActionId !== null || !canBanUsers || !banModal.user}
							onClick={() => void confirmBanUser()}
							type="button"
						>
							Ban user
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog
				onOpenChange={(open) => {
					setSessionsModal((prev) => ({ ...prev, open }));
				}}
				open={sessionsModal.open}
			>
				<DialogContent className="max-w-[min(96vw,1120px)] overflow-hidden p-0">
					<div className="px-6 pt-6">
						<DialogHeader>
							<DialogTitle>User Sessions</DialogTitle>
							<DialogDescription>
								{sessionsModal.userId
									? `Sessions for ${sessionsModal.userId}`
									: "No user selected"}
							</DialogDescription>
						</DialogHeader>
					</div>

					{sessionsModal.isLoading ? (
						<div className="px-6 py-8">
							<div className="flex items-center gap-2 text-muted-foreground text-sm">
								<Loader2 className="size-4 animate-spin" />
								Loading sessions...
							</div>
						</div>
					) : (
						<div className="max-h-[65vh] overflow-auto border-y">
							<div className="min-w-[940px]">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Session ID</TableHead>
											<TableHead>Token</TableHead>
											<TableHead>Expires</TableHead>
											<TableHead>IP / UA</TableHead>
											<TableHead>Impersonated By</TableHead>
											<TableHead>Action</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{sessionsModal.sessions.length === 0 ? (
											<TableRow>
												<TableCell className="text-muted-foreground" colSpan={6}>
													No active sessions for this user.
												</TableCell>
											</TableRow>
										) : (
											sessionsModal.sessions.map((item) => (
												<TableRow key={item.id}>
													<TableCell className="max-w-[190px] truncate">{item.id}</TableCell>
													<TableCell>{compactToken(item.token)}</TableCell>
													<TableCell>{toDateLabel(item.expiresAt)}</TableCell>
													<TableCell className="max-w-[280px] whitespace-normal">
														<div className="text-xs">{item.ipAddress || "n/a"}</div>
														<div className="text-muted-foreground text-xs">
															{item.userAgent || "n/a"}
														</div>
													</TableCell>
													<TableCell>{item.impersonatedBy || "n/a"}</TableCell>
													<TableCell>
														<Button
															size="sm"
															variant="outline"
															disabled={pendingActionId !== null || !canRevokeSessions}
															onClick={() => void revokeSession(item.token)}
														>
															Revoke
														</Button>
													</TableCell>
												</TableRow>
											))
										)}
									</TableBody>
								</Table>
							</div>
						</div>
					)}

					<div className="flex justify-end px-6 py-4">
						<Button
							onClick={() => setSessionsModal((prev) => ({ ...prev, open: false }))}
							type="button"
							variant="outline"
						>
							Close
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default AdminDashboard;
