import type * as MaterialIcons from "@vicons/material";
export { };

type IconsWithStyle = keyof typeof MaterialIcons;
type RemoveStyleFromIcon<TIconName extends string> = {
	[IconName in TIconName]:
		IconName extends `${infer Icon}Filled` ? Icon :
		IconName extends `${infer Icon}Outlined` ? Icon :
		IconName extends `${infer Icon}Round` ? Icon :
		IconName extends `${infer Icon}Sharp` ? Icon :
		IconName extends `${infer Icon}Twotone` ? Icon : IconName;
}[TIconName & string];
type Icons = Uncapitalize<RemoveStyleFromIcon<IconsWithStyle>>;

declare global {
	export namespace MaterialIcon {
		export type Names = Icons;
		export type Styles = "filled" | "outlined" | "round" | "sharp" | "twotone";
	}
}
