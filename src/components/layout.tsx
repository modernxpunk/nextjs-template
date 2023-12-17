import { PropsWithChildren } from "react";
import Icon from "@/components/ui/icon";

const Layout = ({ children }: PropsWithChildren) => {
	return (
		<div className="flex flex-col min-h-screen">
			<header className="py-3 bg-base-200">
				<nav className="container flex items-center justify-between">
					<div>
						<h1>App</h1>
					</div>
					<div>
						<label className="btn btn-sm btn-ghost btn-circle swap swap-rotate">
							<input
								type="checkbox"
								className="theme-controller"
								value="light"
							/>
							<Icon className="text-2xl swap-on" name="common/sun" />
							<Icon className="text-2xl swap-off" name="common/moon" />
						</label>
					</div>
				</nav>
			</header>
			<main className="flex flex-col flex-1 py-3">{children}</main>
			<footer className="py-3 text-center bg-base-200">Made with love</footer>
		</div>
	);
};

export default Layout;
