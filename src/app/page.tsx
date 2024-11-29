"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import QRCodeStyling from "qr-code-styling";
import { useEffect, useRef, useState } from "react";
import useSystemTheme from "use-system-theme";

const QR_SIZE = 250;

const Page = () => {
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

	const [active, setActive] = useState<1 | 2 | 3>(1);

	const [country, setCountry] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");

	const IconTelegram = () => {
		return (
			// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
			<svg
				className="text-[120px] sm:text-[160px] icon"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 120 120"
			>
				<defs>
					<linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="a">
						<stop
							stopColor={theme !== "dark" ? "#3390ed" : "#8774e1"}
							offset="0%"
						/>
						<stop
							stopColor={theme !== "dark" ? "#3390ed" : "#8774e1"}
							offset="110%"
						/>
					</linearGradient>
				</defs>
				<g fill="none">
					<circle fill="url(#a)" cx="60" cy="60" r="60" />
					<path
						d="M23.775 58.77a3278.85 3278.85 0 0 1 39.27-16.223c18.698-7.454 21.3-8.542 23.828-8.58a4.995 4.995 0 0 1 2.977 1.103c1.058.9 1.38 1.47 1.47 1.972.083.503.075 2.07-.015 2.963-1.013 10.207-4.86 33.78-7.088 45.225-.945 4.837-2.805 6.457-4.605 6.615-3.907.345-6.877-2.475-10.664-4.86-5.925-3.728-7.905-5.1-13.65-8.737-6.653-4.2-3.916-5.663-.128-9.436.99-.982 17.415-15.974 17.662-17.34.21-1.2.286-1.357-.254-1.897-.548-.54-1.2-.473-1.62-.383-.6.128-9.645 5.85-27.15 17.176-2.685 1.777-5.115 2.64-7.298 2.595-2.4-.053-7.027-1.305-10.462-2.378-4.223-1.32-7.575-2.01-7.275-4.245.15-1.163 1.814-2.355 5.002-3.57Z"
						fill={theme !== "dark" ? "#FFF" : "#212121"}
					/>
				</g>
			</svg>
		);
	};

	return (
		<div>
			<div className="h-[186px] sm:h-[190px] w-full" />
			<div className="flex relative overflow-hidden justify-center w-full sm:w-[480px] h-[900px] mx-auto">
				<div
					className={cn(
						"absolute w-full sm:w-[480px] h-[500px] transition-all",
						active === 1 ? "left-0" : "-left-full",
					)}
				>
					<div className="flex justify-center mx-auto">
						<IconTelegram />
					</div>
					<h4 className="sm:mt-[41px] mt-[22px] text-[20px] sm:text-[32px] font-medium text-center select-none">
						Sign in to Telegram
					</h4>
					<p
						className={cn(
							"select-none mt-[3px] sm:mt-[8px] font-light text-[14px] sm:text-[16px] text-center",
							theme === "light" ? "text-[#707579]" : "text-[#aaaaaa]",
						)}
					>
						<span className="block">Please confirm your country code</span>
						<br />
						<span className="block -mt-[23px] sm:-mt-[28px]">
							and enter your phone number.
						</span>
					</p>
					<div className="mt-[45px] flex flex-col sm:px-0 px-4 items-center justify-center">
						<div className="max-w-[360px] relative w-full group">
							<input
								value={country}
								onChange={(e) => setCountry(e.target.value)}
								className={cn(
									"border peer outline-none bg-transparent font-light rounded-[10px] w-full p-[15px] group-hover:border-[#3390ec] transition-colors border-[rgb(223,225,229)] caret-[rgb(51,144,236)] dark:border-[rgba(255,255,255,0.08)] dark:caret-[#8774e1] dark:group-hover:border-[#8774e1]",
								)}
							/>
							<span
								className={cn(
									"absolute group-hover:text-[#3390ec] font-light transition-all text-[#9e9e9e] px-1 bg-white peer-focus:text-[12px] peer-focus:-top-2 peer-focus:left-3 dark:bg-[#212121] dark:group-hover:text-[#8774e1]",
									country === ""
										? "text-[16px] top-4 left-3"
										: "text-[12px] -top-2 left-3",
								)}
							>
								Country
							</span>
						</div>
						<div className="max-w-[360px] mt-6 relative w-full group">
							<input
								value={phoneNumber}
								onChange={(e) => setPhoneNumber(e.target.value)}
								className={cn(
									"border peer outline-none bg-transparent font-light rounded-[10px] w-full p-[15px] group-hover:border-[#3390ec] transition-colors border-[rgb(223,225,229)] caret-[rgb(51,144,236)] dark:border-[rgba(255,255,255,0.08)] dark:caret-[#8774e1] dark:group-hover:border-[#8774e1]",
								)}
							/>
							<span
								className={cn(
									"absolute group-hover:text-[#3390ec] font-light transition-all text-[#9e9e9e] px-1 bg-white peer-focus:text-[12px] peer-focus:-top-2 peer-focus:left-3 dark:bg-[#212121] dark:group-hover:text-[#8774e1]",
									phoneNumber === ""
										? "text-[16px] top-4 left-3"
										: "text-[12px] -top-2 left-3",
								)}
							>
								Phone Number
							</span>
						</div>
						<Button className="max-w-[360px] mt-2 w-full">
							<div className="flex gap-8">
								<div className="inline-flex items-center ml-[20px]">
									<label className="relative flex items-center cursor-pointer">
										<input
											type="checkbox"
											// checked
											className="w-5 h-5 transition-all border rounded shadow appearance-none cursor-pointer peer hover:shadow-md border-slate-300 checked:bg-[#3390ec] checked:border-[#3390ec]"
											id="check1"
										/>
										<span className="absolute text-white transform -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 top-1/2 left-1/2">
											{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-3.5 w-3.5"
												viewBox="0 0 20 20"
												fill={cn(
													theme === "light" ? "currentColor" : "#8774e1",
												)}
												stroke={cn(
													theme === "light" ? "currentColor" : "#8774e1",
												)}
												strokeWidth="1"
											>
												<path
													fillRule="evenodd"
													d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
													clipRule="evenodd"
												/>
											</svg>
										</span>
									</label>
								</div>
								<span className="text-black dark:text-white">
									Keep me signed in
								</span>
							</div>
						</Button>

						{country && phoneNumber ? (
							<Button className="bg-primary font-medium text-white hover:bg-opacity-90 max-w-[360px] w-full mt-7">
								NEXT
							</Button>
						) : (
							<div className="w-full h-[54px] mt-7" />
						)}

						<Button
							className="max-w-[360px] w-full mt-2"
							onClick={() => setActive(2)}
						>
							LOG IN BY QR CODE
						</Button>
					</div>
				</div>
				<div
					className={cn(
						"absolute w-full sm:w-[480px] h-[500px] transition-all",
						active === 2 ? "left-0" : "left-full",
					)}
				>
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

					<h4 className="select-none animate-transparency font-medium leading-[110%] tracking-[0.3125px] text-center mt-[14px] sm:mt-[35px] mb-[12px] text-[20px] sm:text-[2rem]">
						Log in to Telegram by QR Code
					</h4>

					<ol className="max-w-[388px] animate-transparency flex flex-col select-none font-light gap-[4px] mt-[31px] sm:mt-[37px] mx-auto w-full list-decimal ps-[43px] sm:ps-[45px]">
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
					<div className="flex justify-center animate-transparency">
						<Button
							className="mt-4 mx-2 sm:mx-0 sm:max-w-[360px]"
							onClick={() => setActive(1)}
						>
							LOG IN BY PHONE NUMBER
						</Button>
					</div>
				</div>
				{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
				<div
					onClick={() => setActive(3)}
					className={cn(
						"absolute w-full sm:w-[480px] h-[500px] transition-all bg-emerald-700",
						active === 3 ? "left-0" : "left-full",
					)}
				>
					asdfasdf
				</div>
			</div>
		</div>
	);
};

export default Page;
