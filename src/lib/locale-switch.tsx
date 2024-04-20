"use client";

import Icon from "@/components/icon";
import Link from "next/link";
import { useRef } from "react";

const LocaleSwitcher = () => {
	const detailsRef = useRef<HTMLDetailsElement | null>(null);

	return (
		<details ref={detailsRef} className="dropdown dropdown-end">
			<summary className="btn btn-ghost">
				<Icon className="text-2xl" name="common/translate" />
				<Icon className="text-xl" name="common/chevron-down" />
			</summary>
			<div className="p-2 shadow menu mt-4 dropdown-content z-[1] bg-base-200 rounded-box w-52">
				<Link href="/en" prefetch={false}>
					<button
						className="w-full btn"
						onClick={() =>
							detailsRef.current && (detailsRef.current.open = false)
						}
					>
						{"english"}
					</button>
				</Link>
				<Link href="/uk" prefetch={false}>
					<button
						className="w-full btn"
						onClick={() =>
							detailsRef.current && (detailsRef.current.open = false)
						}
					>
						{"ukrainian"}
					</button>
				</Link>
			</div>
		</details>
	);
};

export default LocaleSwitcher;
