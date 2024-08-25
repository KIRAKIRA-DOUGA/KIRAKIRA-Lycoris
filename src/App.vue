<script setup lang="ts">
	import { NThemeEditor } from "naive-ui";
	const { theme, themeOverrides } = useOsTheme();

	const menuOptions = [
		{
			label: "且听风吟",
			key: "hear-the-wind-sing",
		},
		{
			label: "1973年的弹珠玩具",
			key: "pinball-1973",
			disabled: true,
			children: [
				{
					label: "鼠",
					key: "rat",
				},
			],
		},
		{
			label: "寻羊冒险记",
			key: "a-wild-sheep-chase",
			disabled: true,
		},
		{
			label: "舞，舞，舞",
			key: "dance-dance-dance",
			children: [
				{
					type: "group",
					label: "人物",
					key: "people",
					children: [
						{
							label: "叙事者",
							key: "narrator",
						},
						{
							label: "羊男",
							key: "sheep-man",
						},
					],
				},
				{
					label: "饮品",
					key: "beverage",
					children: [
						{
							label: "威士忌",
							key: "whisky",
						},
					],
				},
				{
					label: "食物",
					key: "food",
					children: [
						{
							label: "三明治",
							key: "sandwich",
						},
					],
				},
				{
					label: "过去增多，未来减少",
					key: "the-past-increases-the-future-recedes",
				},
			],
		},
	];
</script>

<template>
	<NConfigProvider :theme="theme" :themeOverrides="themeOverrides">
		<NBackTop :right="100" />
		<NThemeEditor>
			<NFlex vertical :style="{ gap: 0, height: '100dvh' }">
				<NLayoutHeader>
					<NH2>KIRAKIRA-Lycoris</NH2>
				</NLayoutHeader>
				<NLayout hasSider>
					<NLayoutSider
						bordered
						collapseMode="width"
						:collapsedWidth="64"
						:width="240"
						:nativeScrollbar="false"
						showTrigger="bar"
					>
						<NMenu
							:collapsedWidth="64"
							:collapsedIconSize="22"
							:options="menuOptions"
						/>
					</NLayoutSider>
					<NLayout />
				</NLayout>
			</NFlex>
		</NThemeEditor>
	</NConfigProvider>
</template>
