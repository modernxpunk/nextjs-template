import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

interface SpritesMap {
	common: "";
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
		<svg className={cn("icon", className)} focusable="false" {...props}>
			<use xlinkHref={`/images/sprites/${spriteName}.svg#${iconName}`} />
		</svg>
	);
};

export default Icon;
