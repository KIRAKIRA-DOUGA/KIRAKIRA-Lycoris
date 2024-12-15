<script setup lang="ts">
	const selfUserInfoStore = useSelfUserInfoStore();

	const email = ref("");
	const password = ref("");

	/**
	 * 登录。
	 */
	async function requestLogin() {
		if (!email && !password) {
			console.error("请输入邮箱和密码来登录");
			alert("请输入邮箱和密码来登录");
		}

		const passwordHash = await generateHash(password.value);
		const userLoginRequest = {
			email: email.value,
			passwordHash,
		};

		await userLogin(userLoginRequest);
	}
</script>

<template>
	<div class="container">
		<div v-if="!selfUserInfoStore.isLogined">
			<NCard title="登录">
				<NForm>
					<NFormItem label="邮箱">
						<NInput v-model:value="email" placeholder="请输入邮箱" type="email" />
					</NFormItem>
					<NFormItem label="密码">
						<NInput v-model:value="password" placeholder="请输入密码" type="password" />
					</NFormItem>
					<div>
						<NButton type="primary" round attrType="button" @click="requestLogin">登录</NButton>
					</div>
				</NForm>
			</NCard>
		</div>
	</div>
</template>
