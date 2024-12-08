"use client";

import Icon from "@/components/icon";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const DropdownTheme = () => {
	const [mounted, setMounted] = useState(false);
	const { resolvedTheme, setTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	const toggleTheme = () => {
		setTheme(resolvedTheme === "dark" ? "light" : "dark");
	};

	if (!mounted) {
		return (
			<button className="btn btn-circle btn-ghost skeleton animate-appear" />
		);
	}

	return (
		<label className="swap btn btn-circle btn-ghost swap-rotate animate-appear">
			<input
				onChange={toggleTheme}
				value={resolvedTheme}
				type="checkbox"
				className="theme-controller"
			/>
			<Icon className="text-2xl swap-on" name="common/white-balance-sunny" />
			<Icon className="text-2xl swap-off" name="common/moon-waning-crescent" />
		</label>
	);
};

export default DropdownTheme;
