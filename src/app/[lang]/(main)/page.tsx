"use client";

import Icon from "@/components/icon";
import { cn } from "@/lib/utils";
import type { PageWithLang } from "@/types";
import QRCodeStyling from "qr-code-styling";
import { useEffect, useRef, useState } from "react";
import useSystemTheme from "use-system-theme";

const QR_SIZE = 250;

const Page: PageWithLang = ({ params: { lang } }) => {
	// const dict = await getDictionary(lang);
	const canvasRef = useRef<HTMLDivElement>(null);
	const theme = useSystemTheme();
	const [isLoadingQrCode, setIsLoadingQrCode] = useState(true);

	const [token, setToken] = useState("");

	useEffect(() => {
		// const data = `${DATA_PREFIX}${authQrCode.token}`;

		if (isLoadingQrCode) {
			return;
		}

		if (token === "") {
			return;
		}

		const options = {
			width: QR_SIZE,
			height: QR_SIZE,
			data: token,
			image: "/blank.png",
			margin: 0,
			type: "svg",
			dotsOptions: {
				type: "rounded",
				color: theme === "dark" ? "white" : "black",
			},
			cornersSquareOptions: {
				type: "extra-rounded",
			},

			imageOptions: {
				imageSize: 0.4,
				margin: 8,
			},
			qrOptions: {
				errorCorrectionLevel: "M",
			},
			backgroundOptions: {
				color: "transparent",
			},
		};

		// @ts-ignore
		const qrCode = new QRCodeStyling(options);
		if (canvasRef.current !== null) {
			if (canvasRef.current.children.length === 0) {
				qrCode.append(canvasRef.current);
			} else {
				canvasRef.current.innerHTML = "";
				qrCode.append(canvasRef.current);
			}
		}
	}, [token, isLoadingQrCode, theme]);

	useEffect(() => {
		setTimeout(() => {
			const DATA_PREFIX = "tg://login?token=";
			const authQrCode = {
				token: "dfaafsdfasdfasdfasdfasdf",
			};
			const data = `${DATA_PREFIX}${authQrCode.token}`;
			setToken(data);
			setIsLoadingQrCode(false);
		}, 1000);
	}, []);

	const timer = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		let i = 0;
		timer.current = setInterval(() => {
			const DATA_PREFIX = "tg://login?token=";

			const authQrCode = {
				token: String(`sdgpasdjpgasdpofaposkdfa${i++}`),
			};
			const data = `${DATA_PREFIX}${authQrCode.token}`;
			setToken(data);
		}, 30_000);
		return () => {
			if (timer.current !== null) {
				clearInterval(timer.current);
			}
		};
	}, []);

	const [coords, setCoords] = useState({ x: -1, y: -1 });
	const [isRippling, setIsRippling] = useState(false);

	useEffect(() => {
		if (coords.x !== -1 && coords.y !== -1) {
			setIsRippling(true);
			setTimeout(() => setIsRippling(false), 300);
		} else {
			setIsRippling(false);
		}
	}, [coords]);

	useEffect(() => {
		if (!isRippling) setCoords({ x: -1, y: -1 });
	}, [isRippling]);

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		setCoords({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		});
	};

	return (
		<div>
			<div className="h-[190px] w-full" />
			<div className="flex justify-center">
				<div className="max-w-[480px] w-full">
					<div
						className="relative flex items-center justify-center mx-auto"
						style={{
							display: isLoadingQrCode ? "flex" : "none",
							width: `${QR_SIZE}px`,
							height: `${QR_SIZE}px`,
						}}
					>
						<div
							className={cn(
								"mx-auto loading loading-lg text-primary loading-spinner",
								isLoadingQrCode && "animate-appear",
							)}
						/>
					</div>
					<div
						className="relative mx-auto"
						style={{
							width: `${QR_SIZE}px`,
							height: `${QR_SIZE}px`,
							overflow: "hidden",
							display: !isLoadingQrCode ? "block" : "none",
						}}
					>
						<div
							className={cn(
								"mx-auto relative",
								!isLoadingQrCode && "animate-appear",
							)}
							ref={canvasRef}
							style={{
								width: `${QR_SIZE}px`,
								height: `${QR_SIZE}px`,
								backgroundColor: "transparent",
								display: !isLoadingQrCode ? "block" : "none",
								overflow: "hidden",
							}}
						/>
						{!isLoadingQrCode && (
							<div className="absolute inset-0 flex items-center justify-center animate-appear">
								{theme === "dark" ? (
									// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
									<svg
										className="text-[40px] icon"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 120 120"
									>
										<defs>
											<linearGradient
												x1="50%"
												y1="0%"
												x2="50%"
												y2="100%"
												id="a"
											>
												<stop stop-color="#8774e1" offset="0%" />
												<stop stop-color="#8774e1" offset="100%" />
											</linearGradient>
										</defs>
										<g fill="none">
											<circle fill="url(#a)" cx="60" cy="60" r="60" />
											<path
												d="M23.775 58.77a3278.85 3278.85 0 0 1 39.27-16.223c18.698-7.454 21.3-8.542 23.828-8.58a4.995 4.995 0 0 1 2.977 1.103c1.058.9 1.38 1.47 1.47 1.972.083.503.075 2.07-.015 2.963-1.013 10.207-4.86 33.78-7.088 45.225-.945 4.837-2.805 6.457-4.605 6.615-3.907.345-6.877-2.475-10.664-4.86-5.925-3.728-7.905-5.1-13.65-8.737-6.653-4.2-3.916-5.663-.128-9.436.99-.982 17.415-15.974 17.662-17.34.21-1.2.286-1.357-.254-1.897-.548-.54-1.2-.473-1.62-.383-.6.128-9.645 5.85-27.15 17.176-2.685 1.777-5.115 2.64-7.298 2.595-2.4-.053-7.027-1.305-10.462-2.378-4.223-1.32-7.575-2.01-7.275-4.245.15-1.163 1.814-2.355 5.002-3.57Z"
												fill="#212121"
											/>
										</g>
									</svg>
								) : (
									// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
									<svg
										className="text-[40px] icon"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 120 120"
									>
										<defs>
											<linearGradient
												x1="50%"
												y1="0%"
												x2="50%"
												y2="100%"
												id="a"
											>
												<stop stop-color="#3390ed" offset="0%" />
												<stop stop-color="#3390ed" offset="100%" />
											</linearGradient>
										</defs>
										<g fill="none">
											<circle fill="url(#a)" cx="60" cy="60" r="60" />
											<path
												d="M23.775 58.77a3278.85 3278.85 0 0 1 39.27-16.223c18.698-7.454 21.3-8.542 23.828-8.58a4.995 4.995 0 0 1 2.977 1.103c1.058.9 1.38 1.47 1.47 1.972.083.503.075 2.07-.015 2.963-1.013 10.207-4.86 33.78-7.088 45.225-.945 4.837-2.805 6.457-4.605 6.615-3.907.345-6.877-2.475-10.664-4.86-5.925-3.728-7.905-5.1-13.65-8.737-6.653-4.2-3.916-5.663-.128-9.436.99-.982 17.415-15.974 17.662-17.34.21-1.2.286-1.357-.254-1.897-.548-.54-1.2-.473-1.62-.383-.6.128-9.645 5.85-27.15 17.176-2.685 1.777-5.115 2.64-7.298 2.595-2.4-.053-7.027-1.305-10.462-2.378-4.223-1.32-7.575-2.01-7.275-4.245.15-1.163 1.814-2.355 5.002-3.57Z"
												fill="#FFF"
											/>
										</g>
									</svg>
								)}
							</div>
						)}
					</div>

					<h4 className="select-none font-medium leading-[110%] tracking-[0.3125px] text-center mt-[14px] sm:mt-[35px] mb-[12px] text-[20px] sm:text-[2rem]">
						Log in to Telegram by QR Code
					</h4>

					<ol
						className="max-w-[388px] flex flex-col select-none font-light gap-[4px] mt-[31px] sm:mt-[37px] mx-auto w-full list-decimal"
						style={{
							paddingInlineStart: "40px",
						}}
					>
						<li className="text-[16.2px]">Open Telegram on your phone</li>
						<li>
							<span className="text-[16.2px]">
								Go to <b>Settings</b> &gt; <b>Devices</b> &gt;{" "}
								<b>Link Desktop Device</b>
							</span>
						</li>
						<li className="text-[16.2px]">
							Point your phone at this screen to confirm login
						</li>
					</ol>
					<div className="flex justify-center">
						<button
							onClick={handleClick}
							className="mt-4 text-[16px] relative overflow-hidden font-light max-w-[360px] bg-transparent text-primary h-[54px] rounded-[10px] w-full hover:bg-primary hover:bg-opacity-10"
						>
							{isRippling && (
								<span
									className="absolute rounded-full animate-ripple pointer-events-none bg-white bg-opacity-[8%]"
									style={{
										left: coords.x,
										top: coords.y,
										transform: "translate(-50%, -50%)",
									}}
								/>
							)}
							LOG IN BY PHONE NUMBER
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Page;
