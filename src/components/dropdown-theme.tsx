"use client";

import Icon from "@/components/icon";
import { useTheme } from "next-themes";
import { tw } from "typewind";

const DropdownTheme = () => {
	const { resolvedTheme, setTheme } = useTheme();

	const toggleTheme = () => {
		setTheme(resolvedTheme === "dark" ? "light" : "dark");
	};

	return (
		<label className={tw.swap.btn.btn_circle.btn_ghost.swap_rotate}>
			<input
				type="checkbox"
				className="theme-controller"
				onChange={toggleTheme}
				value={resolvedTheme}
				checked={resolvedTheme === "dark"}
			/>
			<Icon className={tw.text_2xl.swap_on} name="common/white-balance-sunny" />
			<Icon
				className={tw.text_2xl.swap_off}
				name="common/white-balance-sunny"
			/>
		</label>
	);
};

export default DropdownTheme;
