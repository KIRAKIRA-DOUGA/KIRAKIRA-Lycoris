<script setup lang="ts">
	const dialog = useDialog();

	const isEnableEditUserRole = ref(false);
	const isShowSubmitUserRolesModal = ref(false);
	const inputUid = ref<number>();
	const isUpdatingUserRole = ref(false);

	type RbacRole = GetRbacRoleResponseDto["result"];
	const rbacRole = ref<RbacRole>([]);
	const rbacRoleOption = computed(() => rbacRole.value?.map(role => {
		return {
			label: role.roleName,
			value: role.roleName,
		};
	}));

	const userRolesFormModel = ref<{
		uid: number | undefined;
		uuid: string | undefined;
		username: string | undefined;
		userNickname: string | undefined;
		userRoles: string[] | undefined;
	}>({
		uid: undefined,
		uuid: undefined,
		username: undefined,
		userNickname: undefined,
		userRoles: undefined,
	});

	/**
	 * 通过 UID 获取一个用户的身份
	 */
	async function adminFetchUserRole() {
		if (inputUid.value === undefined || inputUid.value === null) return;

		const adminGetUserRolesByUidRequest: AdminGetUserRolesByUidRequestDto = {
			uid: inputUid.value ?? 0,
		};
		const userRolesResult = await adminGetUserRolesController(adminGetUserRolesByUidRequest);
		if (userRolesResult.success)
			userRolesFormModel.value = {
				uid: userRolesResult.result?.uid,
				uuid: userRolesResult.result?.uuid,
				username: userRolesResult.result?.username,
				userNickname: userRolesResult.result?.userNickname,
				userRoles: userRolesResult.result?.roles.map(role => role.roleName),
			};
	}

	/**
	 * 获取 RBAC 身份
	 */
	async function fetchRbacRole() {
		const getRbacRoleRequest: GetRbacRoleRequestDto = {
			search: {},
			pagination: {
				page: 1,
				pageSize: 1000,
			},
		};
		const rbacRoleResult = await getRbacRoleController(getRbacRoleRequest);
		if (rbacRoleResult.success)
			rbacRole.value = rbacRoleResult.result;
		else
			console.error("ERROR", "获取 RBAC 身份失败。");
	}

	/**
	 * 管理员更新用户的身份
	 */
	async function adminUpdateUserRoles() {
		if (!userRolesFormModel.value.uuid || !userRolesFormModel.value.userRoles) return;

		isUpdatingUserRole.value = true;

		const adminUpdateUserRoleRequest: AdminUpdateUserRoleRequestDto = {
			uuid: userRolesFormModel.value.uuid,
			uid: undefined as never,
			newRoles: userRolesFormModel.value.userRoles,
		};

		const adminUpdateUserRolesResult = await adminUpdateUserRoleController(adminUpdateUserRoleRequest);

		if (adminUpdateUserRolesResult.success) {
			await adminFetchUserRole();
			isEnableEditUserRole.value = false;
			isShowSubmitUserRolesModal.value = false;
		} else
			dialog.error({
				title: "管理员更新用户的身份失败",
				content: adminUpdateUserRolesResult.message,
				positiveText: "知道了",
			});

		isUpdatingUserRole.value = false;
	}

	onMounted(fetchRbacRole);
</script>

<template>
	<div class="container">
		<PageHeading>KIRAKIRA RBAC 用户身份管理</PageHeading>
		<NCollapse class="mlb-4">
			<NCollapseItem title="使用说明">
				<NP>KIRAKIRA RBAC 权限控制的最小单位是 API 路径。</NP>
				<NUl>
					<NLi>一个用户可以拥有多个身份</NLi>
					<NLi>一个身份可以对应多位用户</NLi>
					<NLi>一个身份可以拥有对多个 API 的访问权限</NLi>
					<NLi>一个 API 可以对应多个身份</NLi>
				</NUl>
				<NP>
					你可以查询一个用户的身份，或为其绑定或解除绑定身份。<br />
					拥有以下特殊名称的身份具有特殊效果，在绑定或解除绑定时请多加注意：
				</NP>
				<NUl>
					<NLi><b>root</b> - 拥有 RBAC 的管理权限</NLi>
					<NLi><b>adminsitrator</b> - 拥有对内容管理权限</NLi>
					<NLi><b>developer</b> - 拥有某些开发资源的访问权限</NLi>
					<NLi><b>user</b> - 普通用户</NLi>
					<NLi><b>blocked</b> - 已封禁的用户</NLi>
				</NUl>
				<NP>注意: blocked 身份与其他身份互斥</NP>
			</NCollapseItem>
		</NCollapse>
		<NFlex justify="center">
			<NInputNumber v-model:value="inputUid" placeholder="要查询的用户的 UID" :showButton="false" />
			<NButton @click="adminFetchUserRole"><template #icon><Icon name="search" /></template>查询</NButton>
		</NFlex>
		<NDivider />
		<NForm
			ref="formRef"
			:model="userRolesFormModel"
			labelPlacement="left"
			:labelWidth="160"
			class="max-is-[640px]"
		>
			<NFormItem label="用户 UID" path="uid">
				<NInputNumber v-model:value="userRolesFormModel.uid" placeholder="查询用户后显示" :showButton="false" :disabled="true" />
			</NFormItem>
			<NFormItem label="用户 UUID" path="uuid">
				<NInput v-model:value="userRolesFormModel.uuid" placeholder="查询用户后显示" :disabled="true" />
			</NFormItem>
			<NFormItem label="用户名" path="username">
				<NInput v-model:value="userRolesFormModel.username" placeholder="查询用户后显示" :disabled="true" />
			</NFormItem>
			<NFormItem label="用户昵称" path="userNickname">
				<NInput v-model:value="userRolesFormModel.userNickname" placeholder="查询用户后显示" :disabled="true" />
			</NFormItem>
			<NFormItem label="启用编辑">
				<NSwitch v-model:value="isEnableEditUserRole" />
			</NFormItem>
			<NFormItem label="用户身份" path="userRoles">
				<NTransfer
					:disabled="!isEnableEditUserRole || !userRolesFormModel.uuid"
					v-model:value="userRolesFormModel.userRoles"
					:options="rbacRoleOption"
					sourceFilterable
					targetFilterable
				/>
			</NFormItem>
			<!-- TODO: 我想要 label 的占位又不想显示 label 文本，难道只能用 label=" " 这种不优雅的方式吗？ -->
			<NFormItem label=" ">
				<NButton :disabled="!isEnableEditUserRole || !userRolesFormModel.uuid" @click="isShowSubmitUserRolesModal = true">
					更新用户身份
				</NButton>
			</NFormItem>
		</NForm>

		<NModal
			v-model:show="isShowSubmitUserRolesModal"
			:maskClosable="false"
			preset="dialog"
			title="确认要更新用户的身份吗？"
			negativeText="算了"
			@positiveClick="adminUpdateUserRoles"
		>
			<NForm>
				<NFormItem label="用户 UID">
					<NInputNumber v-model:value="userRolesFormModel.uid" :showButton="false" :disabled="true" class="is-full" />
				</NFormItem>
				<NFormItem label="用户 UUID">
					<NInput v-model:value="userRolesFormModel.uuid" :showButton="false" :disabled="true" />
				</NFormItem>
				<NFormItem label="用户的身份将会更新为下列身份">
					<NFlex>
						<NTag v-for="role in userRolesFormModel.userRoles" :key="role">{{ role }}</NTag>
					</NFlex>
				</NFormItem>
			</NForm>
			<template #action>
				<NButton @click="isShowSubmitUserRolesModal = false">算了</NButton>
				<NButton :loading="isUpdatingUserRole" type="warning" :secondary="true" @click="adminUpdateUserRoles">确认更新</NButton>
			</template>
		</NModal>
	</div>
</template>
