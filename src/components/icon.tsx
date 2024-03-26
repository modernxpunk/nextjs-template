import { cx } from "class-variance-authority";
import { SVGProps } from "react";

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
		<svg className={cx("icon", className)} focusable="false" {...props}>
			<use xlinkHref={`/images/sprites/${spriteName}.svg#${iconName}`} />
		</svg>
	);
};

export default Icon;
