<script setup lang="ts">
	import { NThemeEditor } from "naive-ui";
	import menuOptions from "./menu";
	import "/src/assets/styles/tailwind.css";

	const defaultExpandedKeys = menuOptions.map(option => option.key!);
	const { theme, themeOverrides } = useOsTheme();
</script>

<template>
	<NConfigProvider :theme :themeOverrides>
		<NThemeEditor>
			<NFlex vertical class="gap-0 h-dvh">
				<NLayoutHeader>
					<NH2>KIRAKIRA-Lycoris</NH2>
				</NLayoutHeader>
				<NLayout hasSider>
					<NLayoutSider
						bordered
						collapseMode="width"
						:collapsedWidth="64"
						:width="240"
						showTrigger="bar"
					>
						<NMenu
							:collapsedWidth="64"
							:collapsedIconSize="22"
							:options="menuOptions"
							:defaultExpandedKeys
						/>
					</NLayoutSider>
					<NLayoutContent>
						<NBackTop :right="100" />
						<RouterView />
					</NLayoutContent>
				</NLayout>
			</NFlex>
		</NThemeEditor>
	</NConfigProvider>
</template>

<style>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
