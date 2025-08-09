interface MenuItem {
	label: string;
	to?: string;
	key: string;
	icon: MaterialIcon.Names;
	shown?: boolean;
	children?: MenuItem[];
}

const selfUserInfo = noBackend ? null! : await getSelfUserInfo(undefined, false); // 仅获取数据，不修改 pinia

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
				key: "pending-review",
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
		label: "RBAC 管理",
		key: "rbac",
		icon: "shield",
		shown: checkUserRole(["root", "developer"], selfUserInfo),
		children: [
			{
				label: "API 路径",
				key: "api-path",
				icon: "api",
			},
			{
				label: "身份",
				key: "role",
				icon: "badge",
			},
			{
				label: "用户身份",
				key: "user-roles",
				icon: "person",
			},
		],
	},
	{
		label: "预生产环境密钥",
		key: "stg-secret",
		icon: "key",
		shown: checkUserRole(["root", "developer"], selfUserInfo),
	},
	{
		label: "关于",
		key: "about",
		icon: "info",
	},
];

const menuOptions = (() => {
	function getMenuOptions({ label, to, key, icon, shown, children }: MenuItem, parentKeys: string[] = []): MenuOption {
		const keys = [...parentKeys, key], keysRoute = "/" + keys.join("/");
		if (!children) to ??= keysRoute;
		const menuOption: MenuOption = {
			label: () => to != null ? <RouterLink to={to}>{label}</RouterLink> : label,
			key: keysRoute,
			icon: () => <Icon name={icon} />,
			show: shown,
			children: children ? children.map(item => getMenuOptions(item, keys)) : undefined,
		};
		return menuOption;
	}

	return menu.map(item => getMenuOptions(item));
})();

export default menuOptions;
