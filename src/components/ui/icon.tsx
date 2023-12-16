import { SVGProps } from "react";

interface SpritesMap {
	social: "google" | "facebook" | "twitter" | "discord";
	common:
		| "check"
		| "copy"
		| "close"
		| "email"
		| "lock"
		| "share"
		| "account"
		| "filter"
		| "moon"
		| "search"
		| "setting"
		| "sun";
}

type SpriteKey = {
	[Key in keyof SpritesMap]: `${Key}/${SpritesMap[Key]}`;
}[keyof SpritesMap];

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
	name: SpriteKey;
}

const Icon = ({ name, className, ...props }: IconProps) => {
	const [spriteName, iconName] = name.split("/");
	return (
		<svg className={`icon ${className}`} focusable="false" {...props}>
			<use xlinkHref={`/images/sprites/${spriteName}.svg#${iconName}`} />
		</svg>
	);
};

export default Icon;
