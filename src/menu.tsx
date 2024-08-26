import { BlockRound, DashboardRound, FormatListBulletedRound, ManageAccountsRound, VideoLibraryRound, VideoSettingsRound } from "@vicons/material";
import { NIcon, type MenuOption } from "naive-ui";
import type { Component } from "vue";
import { RouterLink } from "vue-router";

const renderIcon = (Icon: Component) => () => <NIcon>{h(Icon)}</NIcon>;
const link = (label: string, to?: string) => () => to ? <RouterLink to={to}>{label}</RouterLink> : label;

const menuOptions = [
	{
		label: link("仪表盘", "/"),
		key: "dashboard",
		icon: renderIcon(DashboardRound),
	},
	{
		label: "视频",
		key: "video",
		icon: renderIcon(VideoLibraryRound),
		children: [
			{
				label: link("视频管理", "/video/manager"),
				key: "manager",
				icon: renderIcon(VideoSettingsRound),
			},
		],
	},
	{
		label: "用户",
		key: "user",
		icon: renderIcon(ManageAccountsRound),
		children: [
			{
				label: link("用户列表", "/user/list"),
				key: "list",
				icon: renderIcon(FormatListBulletedRound),
			},
			{
				label: link("用户封禁", "/user/block"),
				key: "block",
				icon: renderIcon(BlockRound),
			},
		],
	} as MenuOption,
] as MenuOption[];

export default menuOptions;
