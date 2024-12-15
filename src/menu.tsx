import { NIcon, type MenuOption } from "naive-ui";
import { RouterLink } from "vue-router";

interface MenuItem {
	label: string;
	to?: string;
	key: string;
	icon: MaterialIcon.Names;
	children?: MenuItem[];
}

const menu: MenuItem[] = [
	{
		label: "仪表盘",
		to: "/",
		key: "",
		icon: "dashboard",
	},
	{
		label: "视频",
		key: "video",
		icon: "videoLibrary",
		children: [
			{
				label: "视频管理",
				key: "manager",
				icon: "videoSettings",
			},
		],
	},
	{
		label: "用户",
		key: "user",
		icon: "manageAccounts",
		children: [
			{
				label: "用户列表",
				key: "list",
				icon: "formatListBulleted",
			},
			{
				label: "用户封禁",
				key: "block",
				icon: "block",
			},
		],
	},
];

const menuOptions = (() => {
	function getMenuOptions({ label, to, key, icon, children }: MenuItem, parentKeys: string[] = []): MenuOption {
		const keys = [...parentKeys, key], keysRoute = "/" + keys.join("/");
		if (!children) to ??= keysRoute;
		const menuOption: MenuOption = {
			label: () => to != null ? <RouterLink to={to}>{label}</RouterLink> : label,
			key: keysRoute,
			icon: () => <NIcon><Icon name={icon} /></NIcon>,
			children: children ? children.map(item => getMenuOptions(item, keys)) : undefined,
		};
		return menuOption;
	}

	return menu.map(item => getMenuOptions(item));
})();

export default menuOptions;
