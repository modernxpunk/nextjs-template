"use client";

import Icon from "@/components/icon";
import Link from "next/link";
import { useRef } from "react";
import { tw } from "typewind";

const LocaleSwitcher = () => {
	const detailsRef = useRef<HTMLDetailsElement | null>(null);

	return (
		<details ref={detailsRef} className={tw.dropdown.dropdown_end}>
			<summary className={tw.btn.btn_ghost}>
				<Icon className={tw.text_2xl} name="common/translate" />
				<Icon className={tw.text_xl} name="common/chevron-down" />
			</summary>
			<div
				className={
					tw.p_2.shadow.menu.mt_4.dropdown_content.z_[1].bg_base_200.rounded_box
						.w_52
				}
			>
				<Link href="en" prefetch={false}>
					<button
						className={tw.btn.w_full}
						onClick={() => {
							if (detailsRef.current) {
								detailsRef.current.open = false;
							}
						}}
					>
						{"english"}
					</button>
				</Link>
				<Link href="uk" prefetch={false}>
					<button
						className={tw.btn.w_full}
						onClick={() => {
							if (detailsRef.current) {
								detailsRef.current.open = false;
							}
						}}
					>
						{"ukrainian"}
					</button>
				</Link>
			</div>
		</details>
	);
};

export default LocaleSwitcher;
