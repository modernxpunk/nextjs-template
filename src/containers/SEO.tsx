import Head from "next/head";

interface SEOprops {
	title: string;
	description: string;
	imgSrc: string;
	canonical?: string;
}

const domain = "http://localhost:3000";

const SEO = ({ title, imgSrc, description, canonical = domain }: SEOprops) => {
	return (
		<Head>
			<title>{title}</title>
			<meta name="title" content={title} />
			<meta name="description" content={description} />

			<link
				rel="apple-touch-icon"
				sizes="180x180"
				href="/assets/images/favicon/apple-touch-icon.png"
			/>
			<link
				rel="icon"
				type="image/png"
				sizes="32x32"
				href="/assets/images/favicon/favicon-32x32.png"
			/>
			<link
				rel="icon"
				type="image/png"
				sizes="16x16"
				href="/assets/images/favicon/favicon-16x16.png"
			/>
			<link rel="manifest" href="/assets/images/favicon/site.webmanifest" />
			<link
				rel="mask-icon"
				href="/assets/images/favicon/safari-pinned-tab.svg"
				color="#5bbad5"
			/>
			<meta name="msapplication-TileColor" content="#da532c" />

			{/* <meta name="theme-color" content={theme[themeColor]} /> */}
			{/* <meta name="theme-color" media="(prefers-color-scheme: light)" content="cyan" /> */}
			{/* <meta name="theme-color" media="(prefers-color-scheme: dark)" content="black" /> */}

			<link rel="canonical" href={canonical ?? domain} />
			<meta name="keywords" content="nextjs, template, fun" />

			<meta property="og:type" content="website" />
			<meta property="og:url" content={domain} />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:image" content={imgSrc} />

			<meta property="twitter:card" content="summary_large_image" />
			<meta property="twitter:url" content={domain} />
			<meta property="twitter:title" content={title} />
			<meta property="twitter:description" content={description} />
			<meta property="twitter:image" content={imgSrc} />
		</Head>
	);
};

export default SEO;
