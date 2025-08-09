<script setup lang="ts">
	const selfUserInfoStore = useSelfUserInfoStore();

	const email = ref("");
	const password = ref("");
	const clientOtp = ref(""); // TOTP 验证码

	/**
	 * 登入
	 */
	async function requestLogin() {
		if (!email && !password) {
			console.error("请输入邮箱和密码来登入");
			alert("请输入邮箱和密码来登入");
		}

		const passwordHash = await generateHash(password.value);
		const userLoginRequest = {
			email: email.value,
			passwordHash,
			clientOtp: clientOtp.value,
		};

		const loginResult = await userLogin(userLoginRequest);
		if (loginResult.success && loginResult.UUID)
			location.reload(); // 登入成功后刷新页面...
	}

	/**
	 * 登出
	 */
	async function logout() {
		await userLogout();
		location.reload(); // 尝试刷新页面...
	}

	const emailRule: FormItemRule = {
		trigger: ["input", "blur-sm"],
		type: "email",
		validator() {
			if (!email.value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
				return new Error("邮箱无效");
		},
	};
</script>

<template>
	<div class="container">
		<div v-if="!selfUserInfoStore.isLogined">
			<NCard title="登入">
				<NForm>
					<NFormItem label="邮箱" :rule="emailRule">
						<NInput v-model:value="email" placeholder="请输入邮箱" type="text" />
					</NFormItem>
					<NFormItem label="密码">
						<NInput v-model:value="password" placeholder="请输入密码" type="password" />
					</NFormItem>
					<NP>
						管理员控制台目前仅支持使用 TOTP 验证码登入！<br />
						如果您没有开启 2FA 则无需填写<br />
						如果您使用的是邮箱验证，请前往 KIRAKIRA 主站登入，或将验证方式改为 TOTP。
					</NP>
					<NFormItem label="TOTP 验证码">
						<NInput v-model:value="clientOtp" placeholder="请输入 TOTP 验证码" />
					</NFormItem>
					<div>
						<NButton type="primary" round attrType="button" @click="requestLogin">登入</NButton>
					</div>
				</NForm>
			</NCard>
		</div>
		<div v-else>
			<NFlex vertical size="large">
				<NAlert type="success">你已登入</NAlert>
				<NCard title="你的身份是">
					<NFlex>
						<NTag v-for="role in selfUserInfoStore.roles" :key="role">{{ role }}</NTag>
					</NFlex>
				</NCard>
				<div>
					<NButton type="error" round attrType="button" @click="logout">登出</NButton>
				</div>
			</NFlex>
		</div>
	</div>
</template>
