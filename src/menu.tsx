import { KeyRound, BlockRound, DashboardRound, FormatListBulletedRound, ManageAccountsRound, VideoLibraryRound, VideoSettingsRound } from "@vicons/material";
import { NIcon, type MenuOption } from "naive-ui";
import type { Component } from "vue";
import { RouterLink } from "vue-router";
import type { JSX } from "vue/jsx-runtime";

interface MenuItem {
	label: string;
	to?: string;
	key: string;
	icon: Component;
	children?: MenuItem[];
}

const menu: MenuItem[] = [
	{
		label: "仪表盘",
		to: "/",
		key: "",
		icon: DashboardRound,
	},
	{
		label: "视频",
		key: "video",
		icon: VideoLibraryRound,
		children: [
			{
				label: "视频管理",
				key: "manager",
				icon: VideoSettingsRound,
			},
		],
	},
	{
		label: "用户",
		key: "user",
		icon: ManageAccountsRound,
		children: [
			{
				label: "用户列表",
				key: "list",
				icon: FormatListBulletedRound,
			},
			{
				label: "用户封禁",
				key: "block",
				icon: BlockRound,
			},
		],
	},
	{
		label: "预生产环境密钥",
		to: "/stg-secret",
		key: "stg-secret",
		icon: KeyRound,
	},
];

const menuOptions = (() => {
	function getMenuOptions({ label, to, key, icon, children }: MenuItem, parentKeys: string[] = []): MenuOption {
		const Icon = icon as () => JSX.Element;
		const keys = [...parentKeys, key], keysRoute = "/" + keys.join("/");
		if (!children) to ??= keysRoute;
		const menuOption: MenuOption = {
			label: () => to != null ? <RouterLink to={to}>{label}</RouterLink> : label,
			key: keysRoute,
			icon: () => <NIcon><Icon /></NIcon>,
			children: children ? children.map(item => getMenuOptions(item, keys)) : undefined,
		};
		return menuOption;
	}

	return menu.map(item => getMenuOptions(item));
})();

export default menuOptions;
