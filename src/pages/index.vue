<script setup lang="ts">
	defineProps<{
		msg: string;
	}>();

	const selfUserInfoStore = useSelfUserInfoStore();

	const count = ref(0);
	const email = ref("");
	const password = ref("");

	/**
	 * 登录
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
	<h1>{{ msg }}</h1>

	<div class="card">
		<button type="button" @click="count++">count is {{ count }}</button>
		<p>
			Edit
			<code>components/HelloWorld.vue</code> to test HMR
		</p>
	</div>

	<p>
		Check out
		<a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>, the official Vue + Vite starter
	</p>
	<p>
		Learn more about IDE Support for Vue in the
		<a href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support" target="_blank">Vue Docs Scaling up Guide</a>.
	</p>
	<p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>

	<div v-if="!selfUserInfoStore.isLogined">
		<input class="border border-blue-500" type="text" placeholder="邮箱" v-model="email" />
		<input class="border border-blue-500" type="password" placeholder="密码" v-model="password" />
		<div @click="requestLogin">登录</div>
	</div>
</template>

<style scoped>
	.read-the-docs {
		color: #888;
	}
</style>
