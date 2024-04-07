"use client";

import Icon from "@/components/icon";
import { useTheme } from "next-themes";

const DropdownTheme = () => {
	const { theme, setTheme } = useTheme();

	return (
		<label className="swap btn btn-circle btn-ghost swap-rotate">
			<input
				type="checkbox"
				className="theme-controller"
				onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
				checked={theme === "dark"}
			/>
			<Icon className="text-2xl swap-off" name="common/white-balance-sunny" />
			<Icon className="text-2xl swap-on" name="common/moon-waning-crescent" />
		</label>
	);
};

export default DropdownTheme;
