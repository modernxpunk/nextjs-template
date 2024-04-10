"use client";

import Icon from "@/components/icon";
import { useTheme } from "next-themes";

const DropdownTheme = () => {
	const { resolvedTheme, setTheme } = useTheme();

	const toggleTheme = () => {
		setTheme(resolvedTheme === "dark" ? "light" : "dark");
	};

	return (
		<label className="swap btn btn-circle btn-ghost swap-rotate">
			<input
				type="checkbox"
				className="theme-controller"
				onChange={toggleTheme}
				value={resolvedTheme}
				checked={resolvedTheme === "dark"}
			/>
			<Icon className="text-2xl swap-on" name="common/white-balance-sunny" />
			<Icon className="text-2xl swap-off" name="common/moon-waning-crescent" />
		</label>
	);
};

export default DropdownTheme;
