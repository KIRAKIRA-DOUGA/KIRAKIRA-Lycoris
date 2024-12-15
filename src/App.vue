<script setup lang="ts">
	import { NThemeEditor } from "naive-ui";
	import menuOptions from "./menu";
	import { getSelfUserInfo } from "./api/User/UserController";
	const defaultExpandedKeys = menuOptions.map(option => option.key!);
	const { theme, themeOverrides } = useOsTheme();
	const routePath = computed(() => location.pathname);

	const selfUserInfoStore = useSelfUserInfoStore();

	getSelfUserInfo();
</script>

<template>
	<NConfigProvider :theme :themeOverrides>
		<NThemeEditor>
			<NFlex vertical class="gap-0 h-dvh">
				<NLayoutHeader class="px-6 h-16 flex items-center justify-between" bordered>
					<Logo />
					<NFlex class="items-center">
						<NFlex class="items-center gap-1.5">
							<NAvatar round :size="20" />
							<span>{{ selfUserInfoStore.userNickname }}</span>
							<span class="text-slate-500">@{{ selfUserInfoStore.username }}</span>
						</NFlex>
						<NButton quaternary circle>
							<template #icon>
								<NIcon><Icon name="logOut" /></NIcon>
							</template>
						</NButton>
					</NFlex>
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
							:defaultValue="routePath"
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
