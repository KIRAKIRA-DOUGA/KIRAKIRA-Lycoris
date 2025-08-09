import * as MaterialIcons from "@vicons/material";

const capitalize = (name: string) => name[0].toUpperCase() + name.slice(1);

export default function Icon({ name, style = "round" }: {
	/** 图标名称。 */
	name: MaterialIcon.Names;
	/** 图标样式：填充、轮廓、圆润、双色、锐利。默认为圆润。 */
	style?: MaterialIcon.Styles;
}) {
	const Icon = MaterialIcons[(capitalize(name) + capitalize(style)) as never] as () => JSX.Element;
	return (
		<NIcon>
			<Icon />
		</NIcon>
	);
}
