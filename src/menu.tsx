import type { MenuOption } from "naive-ui";
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
		label: "用户",
		key: "user",
		icon: "group",
		children: [
			{
				label: "用户管理",
				key: "manage",
				icon: "manageAccounts",
			},
			{
				label: "最近更改",
				key: "recent",
				icon: "history",
			},
			{
				label: "用户封禁",
				key: "block",
				icon: "block",
			},
		],
	},
	{
		label: "视频",
		key: "video",
		icon: "videoLibrary",
		children: [
			{
				label: "视频管理",
				key: "manage",
				icon: "videoSettings",
			},
			{
				label: "审核视频",
				key: "pendingReview",
				icon: "approval",
			},
		],
	},
	{
		label: "标签",
		key: "tag",
		icon: "sell",
		children: [
			{
				label: "标签管理",
				key: "manage",
				icon: "sell",
			},
			{
				label: "最近更改",
				key: "recent",
				icon: "history",
			},
		],
	},
	{
		label: "预生产环境密钥",
		to: "/stg-secret",
		key: "stg-secret",
		icon: "key",
	},
];

const menuOptions = (() => {
	function getMenuOptions({ label, to, key, icon, children }: MenuItem, parentKeys: string[] = []): MenuOption {
		const keys = [...parentKeys, key], keysRoute = "/" + keys.join("/");
		if (!children) to ??= keysRoute;
		const menuOption: MenuOption = {
			label: () => to != null ? <RouterLink to={to}>{label}</RouterLink> : label,
			key: keysRoute,
			icon: () => <Icon name={icon} />,
			children: children ? children.map(item => getMenuOptions(item, keys)) : undefined,
		};
		return menuOption;
	}

	return menu.map(item => getMenuOptions(item));
})();

export default menuOptions;
