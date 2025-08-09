<script setup lang="ts">
	const message = useMessage();
	const secretType = ref<"hidden" | "windows" | "bash">("hidden");
	const getShownText = (shown: boolean) => shown ? "展示" : "隐藏";

	type StgEnvBackEndSecret = GetStgEnvBackEndSecretResponse["result"];
	const stgEnvBackEndSecretData = ref<StgEnvBackEndSecret["envs"]>(); // 环境变量数据（对象格式）
	const computedWindwowsStgEnvBackEndSecretData = computed(() => { // 环境变量数据（Windows Powershell 字符串格式）
		return Object.entries(stgEnvBackEndSecretData.value ?? {})
			.map(([key, value]) => `$env:${key}="${value}"`)
			.join("\n") + "\n\nclear";
	});
	const computedBashStgEnvBackEndSecretData = computed(() => { // 环境变量数据（Bash 字符串格式）
		return Object.entries(stgEnvBackEndSecretData.value ?? {})
			.map(([key, value]) => `export ${key}="${value}"`)
			.join("\n") + "\n\nclear";
	});

	/**
	 * 拷贝环境变量机密到剪贴板。
	 */
	function copySecret() {
		if (secretType.value === "hidden")
			return;
		else if (secretType.value === "windows")
			navigator.clipboard.writeText(computedWindwowsStgEnvBackEndSecretData.value).then(() => {
				message.info("密钥已复制");
			});
		else
			navigator.clipboard.writeText(computedBashStgEnvBackEndSecretData.value).then(() => {
				message.info("密钥已复制");
			});
	}

	/**
	 * 获取预生产环境后端环境变量机密
	 */
	async function getStgEnvBackEndSecret() {
		const stgEnvBackEndSecretResult = await getStgEnvBackEndSecretController();
		if (stgEnvBackEndSecretResult.success)
			stgEnvBackEndSecretData.value = stgEnvBackEndSecretResult.result.envs;
	}

	onMounted(getStgEnvBackEndSecret);
</script>

<template>
	<div class="container">
		<PageHeading>KIRAKIRA 预生产环境 环境变量</PageHeading>
		<NFlex size="small">
			<NTag type="error">密钥严禁公开</NTag>
			<NTag>请先阅读使用说明</NTag>
		</NFlex>
		<NCollapse class="mlb-4">
			<NCollapseItem title="使用说明">
				<NP>点击下方按钮后，将会显示 KIRAKIRA 预生产环境的环境变量。</NP>
				<NP>
					这些环境变量包括了后端程序端口、Cloudflare 密钥、数据库密钥、搜索引擎密钥、邮件服务密钥和获取以下密钥使用的密钥。<br />
					<b>任何对密钥的公开披露或滥用行为将会导致严重的隐私泄露事故，并涉嫌违法！</b>
				</NP>
				<NP>最佳实践：随用随取，请不要保存这些密钥至本地。仅在程序启动前复制并粘贴一次，然后清空剪贴板。</NP>
				<NP>请允许我引用某些 linux 发行版中的安全格言：</NP>
				<NBlockquote>
					<NP>We trust you have received the usual lecture from the local System Administrator. It usually boils down to these three things:</NP>
					<NOl class="paren-after">
						<NLi>Respect the privacy of others.</NLi>
						<NLi>Think before you type.</NLi>
						<NLi>With great power comes great responsibility.</NLi>
					</NOl>
				</NBlockquote>
				<NBlockquote>
					<NP>我们信任您已经从系统管理员那里了解了日常注意事项。总结起来无外乎这三点：</NP>
					<NOl class="paren-after">
						<NLi>尊重别人的隐私。</NLi>
						<NLi>输入前要先考虑（后果和风险）。</NLi>
						<NLi>权力越大，责任越大。</NLi>
					</NOl>
				</NBlockquote>
			</NCollapseItem>
		</NCollapse>
		<NFlex class="mbe-4 justify-between">
			<NFlex>
				<NButton :secondary="secretType !== 'windows'" strong type="warning" @click="secretType = secretType !== 'windows' ? 'windows' : 'hidden'">{{ getShownText(secretType !== "windows") }} Windows PowerShell 格式的环境变量</NButton>
				<NButton :secondary="secretType !== 'bash'" strong type="warning" @click="secretType = secretType !== 'bash' ? 'bash' : 'hidden'">{{ getShownText(secretType !== "bash") }} Bash (macOS / Linux) 格式的环境变量</NButton>
			</NFlex>
			<NFlex>
				<NButton :disabled="secretType === 'hidden'" strong secondary @click="copySecret"><template #icon>
					<Icon name="contentCopy" />
				</template>复制</NButton>
			</NFlex>
		</NFlex>

		<NCollapseTransition :show="secretType !== 'hidden'">
			<NCode v-if="secretType === 'windows'" :code="computedWindwowsStgEnvBackEndSecretData" showLineNumbers language="powershell" />
			<NCode v-else-if="secretType === 'bash'" :code="computedBashStgEnvBackEndSecretData" showLineNumbers language="bash" />
		</NCollapseTransition>
	</div>
</template>
