<script setup lang="ts">
	import { NThemeEditor, zhCN, dateZhCN, type GlobalThemeOverrides } from "naive-ui";
	import menuOptions from "./menu";
	import hljs from "highlight.js/lib/core";
	import powershell from "highlight.js/lib/languages/powershell";
	import bash from "highlight.js/lib/languages/bash";
	import { merge } from "lodash-es";

	hljs.registerLanguage("powershell", powershell);
	hljs.registerLanguage("bash", bash);

	const defaultExpandedKeys = menuOptions.map(option => option.key!);
	const { theme, themeOverrides: themeColorOverrides } = useOsTheme();
	const themeOverrides = computed<GlobalThemeOverrides>(() => merge(
		themeColorOverrides.value,
		{
			common: {
				fontFamilyMono: "var(--font-mono)", // Naive UI default: v-mono, SFMono-Regular, Menlo, Consolas, Courier, monospace
			},
		},
	));
	const isNarrow = ref(false);

	const selfUserInfoStore = useSelfUserInfoStore();
	if (!noBackend) getSelfUserInfo();

	onMounted(() => {
		const media = window.matchMedia("(width < 900px)");
		isNarrow.value = media.matches;
		media.onchange = ({ matches }) => isNarrow.value = matches;
	});
</script>

<template>
	<NConfigProvider
		:theme
		:themeOverrides
		:hljs="hljs"
		:locale="zhCN"
		:dateLocale="dateZhCN"
	>
		<NMessageProvider>
			<NDialogProvider>
				<NThemeEditor>
					<NFlex vertical class="gap-0 h-dvh">
						<NLayoutHeader class="gap-2 pli-6 bs-16 flex items-center justify-between shrink-0" bordered>
							<Logo />
							<NMenu
								mode="horizontal"
								:options="menuOptions"
								:value="$route.path"
								responsive
								v-if="isNarrow"
							/>
							<NFlex class="items-center shrink-0">
								<NFlex class="items-center gap-1.5">
									<!-- TODO: 头像的链接计算... 要根据生产环境还是测试环境计算吗？ -->
									<NAvatar round :size="20" />
									<span>{{ selfUserInfoStore.userNickname }}</span>
									<span class="text-slate-500">@{{ selfUserInfoStore.username }}</span>
								</NFlex>
								<NButton quaternary circle>
									<template #icon>
										<Icon name="logOut" />
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
								v-if="!isNarrow"
							>
								<NMenu
									:collapsedWidth="64"
									:collapsedIconSize="22"
									:options="menuOptions"
									:defaultExpandedKeys
									:value="$route.path"
								/>
							</NLayoutSider>
							<NLayoutContent>
								<NBackTop :right="100" />
								<RouterView v-slot="{ Component, route }">
									<Transition name="page-jump" mode="out-in">
										<component :is="Component" :key="route.path" />
									</Transition>
								</RouterView>
							</NLayoutContent>
						</NLayout>
					</NFlex>
				</NThemeEditor>
			</NDialogProvider>
		</NMessageProvider>
	</NConfigProvider>
</template>

<style>
	.page-jump-leave-active {
		transition: all 100ms cubic-bezier(0.95, 0.05, 0.795, 0.035);
	}

	.page-jump-enter-active {
		transition: all 600ms cubic-bezier(0.1, 0.9, 0.2, 1);
	}

	.page-jump-enter-from {
		@apply translate-y-[8rem] opacity-0;
	}

	.page-jump-leave-to {
		@apply translate-y-[-2rem] opacity-0;
	}
</style>
