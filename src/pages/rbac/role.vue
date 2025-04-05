<script setup lang="tsx">
	const dialog = useDialog();

	type RbacRole = GetRbacRoleResponseDto["result"];

	const isShowDeleteRoleModal = ref(false);
	const currentDeletingRole = ref("");
	const userInputDeleteingRole = ref("");
	const isDeletingRole = ref(false);

	const isShowCreateNewRoleModal = ref(false);
	const isCreatingRole = ref(false);
	const EMPTY_ROLE_CREATE_DATA = {
		roleName: "",
		roleType: "",
		roleColor: "",
		roleDescription: "",
	};
	const createRoleFormModal = ref<CreateRbacRoleRequestDto>({ ...EMPTY_ROLE_CREATE_DATA });

	type RbacApiPath = GetRbacApiPathResponseDto["result"];
	const rbacApiPath = ref<RbacApiPath>([]);
	const isShowEditRoleModal = ref(false);
	const isEditingRole = ref(false);
	const EMPTY_ROLE_UPDATE_DATA = {
		roleName: "",
		apiPathPermissions: [],
	};
	const updateApiPathPermissionsForRoleFormModal = ref<UpdateApiPathPermissionsForRoleRequestDto>(EMPTY_ROLE_UPDATE_DATA);

	const columns: DataTableColumns<NonNullable<RbacRole>[number]> = [
		{
			title: "角色名",
			key: "roleName",
			render: row => <NTag color={{ color: row.roleColor }}>{row.roleName}</NTag>,
		},
		{
			title: "可以访问以下 API 路径",
			key: "apiPathPermissions",
			ellipsis: true,
			width: "min(400px, 40dvw)",
			render: row => row.apiPathPermissions.map(apiPath => <NTag class="mie-2">{apiPath}</NTag>),
		},
		{
			type: "expand",
			renderExpand: rowData => [
				<div id={`${rowData.roleName}-expand-title`} class="mbe-2">{`角色 ${rowData.roleName} 有以下 API 路径的访问权限`}</div>,
				...rowData.apiPathList.map(apiPath => <NTag color={{ color: apiPath.apiPathColor }} class="mie-2 mbe-1">{apiPath.apiPath}</NTag>),
			],
		},
		{
			title: "类型",
			key: "roleType",
		},
		{
			title: "显示颜色",
			key: "roleColor",
		},
		{
			title: "备注",
			key: "roleDescription",
		},
		{
			title: "操作",
			key: "actions",
			render: row => (
				<Fragment>
					<NButton strong secondary size="small" class="mie-2" onClick={() => openEditRoleModal(row)}>编辑</NButton>
					<NButton strong secondary size="small" type="warning" onClick={() => openDeleteRoleModal(row.roleName ?? "")}>删除</NButton>
				</Fragment>
			),
		},
	];

	const rbacRole = ref<RbacRole>([]);
	const rbacRoleCount = ref(0);
	const pagination = reactive({
		page: 1,
		pageSize: 50,
		showSizePicker: true,
		pageSizes: [5, 10, 20, 50, 100, 200],
		onChange: async (page: number) => {
			pagination.page = page;
			await fetchRbacRole();
		},
		onUpdatePageSize: async (pageSize: number) => {
			pagination.pageSize = pageSize;
			pagination.page = 1;
			await fetchRbacRole();
		},
	});
	const rbacRolePageCount = computed(() => getPageCountByDataCount(rbacRoleCount.value, pagination.pageSize));

	/**
	 * 获取 RBAC 角色
	 */
	async function fetchRbacRole() {
		const getRbacRoleRequest: GetRbacRoleRequestDto = {
			search: {},
			pagination: {
				page: pagination.page,
				pageSize: pagination.pageSize,
			},
		};
		const rbacRoleResult = await getRbacRoleController(getRbacRoleRequest);
		if (rbacRoleResult.success) {
			rbacRole.value = rbacRoleResult.result;
			rbacRoleCount.value = rbacRoleResult.count ?? 0;
		} else
			console.error("ERROR", "获取 RBAC 角色失败。");
	}

	/**
	 * 清除数据并打开创建角色的模态框
	 */
	function openCreateRoleModal() {
		createRoleFormModal.value = { ...EMPTY_ROLE_CREATE_DATA };
		isShowCreateNewRoleModal.value = true;
	}

	/**
	 * 关闭创建角色的模态框，并清除数据
	 */
	function closeCreateRoleModal() {
		isShowCreateNewRoleModal.value = false;
		createRoleFormModal.value = { ...EMPTY_ROLE_CREATE_DATA };
	}

	/**
	 * 创建 RBAC 角色
	 */
	async function createRole() {
		const createRbacRoleRequest: CreateRbacRoleRequestDto = { ...createRoleFormModal.value };
		if (!createRbacRoleRequest.roleName) {
			console.error("ERROR", "创建角色失败，参数不合法");
			return;
		}
		isCreatingRole.value = true;
		const createRbacRoleResult = await createRbacRoleController(createRbacRoleRequest);
		if (createRbacRoleResult.success) {
			await fetchRbacRole();
			closeCreateRoleModal();
		}

		isCreatingRole.value = false;
	}

	/**
	 * 获取 RBAC API 路径
	 */
	async function fetchRbacApiPath() {
		const getRbacApiPathRequest: GetRbacApiPathRequestDto = {
			search: {},
			pagination: {
				page: 1,
				pageSize: 100000,
			},
		};
		const rbacApiPathResult = await getRbacApiPathController(getRbacApiPathRequest);
		if (rbacApiPathResult.success)
			rbacApiPath.value = rbacApiPathResult.result;
		else
			console.error("ERROR", "获取 RBAC API 路径失败。");
	}

	/**
	 * 删除 RBAC 角色
	 * @param roleName 要删除的 RBAC 角色的名字
	 */
	async function fetchDeleteRbacRole(roleName: string) {
		isDeletingRole.value = true;
		const deleteRbacRoleRequest: DeleteRbacRoleRequestDto = {
			roleName,
		};

		const deleteRbacApiPathResult = await deleteRbacRoleController(deleteRbacRoleRequest);
		if (!deleteRbacApiPathResult.success)
			dialog.error({
				title: "删除 RBAC 角色失败",
				content: deleteRbacApiPathResult.message,
				positiveText: "知道了",
			});

		await fetchRbacRole();
		closeDeleteRoleModal();
		isDeletingRole.value = false;
	}

	/**
	 * 开启删除角色的模态框
	 * @param roleName 要删除的角色的名字
	 */
	function openDeleteRoleModal(roleName: string) {
		currentDeletingRole.value = roleName;
		userInputDeleteingRole.value = "";
		isShowDeleteRoleModal.value = true;
	}

	/**
	 * 关闭删除角色的模态框
	 */
	function closeDeleteRoleModal() {
		currentDeletingRole.value = "";
		userInputDeleteingRole.value = "";
		isShowDeleteRoleModal.value = false;
	}

	/**
	 * 设置数据并打开编辑角色的模态框
	 * @param roleData 正在更新的角色数据
	 */
	function openEditRoleModal(roleData: NonNullable<RbacRole>[number]) {
		updateApiPathPermissionsForRoleFormModal.value = {
			roleName: roleData.roleName,
			apiPathPermissions: roleData.apiPathPermissions.map(apiPath => apiPath),
		};
		isShowEditRoleModal.value = true;
	}

	/**
	 * 关闭编辑角色的模态框并清除数据
	 */
	function closeEditRoleModal() {
		isShowEditRoleModal.value = false;
		updateApiPathPermissionsForRoleFormModal.value = EMPTY_ROLE_UPDATE_DATA;
	}

	/**
	 * 更新角色的 API 路径
	 */
	async function updateApiPathPermissionsForRole() {
		isEditingRole.value = true;
		const updateApiPathPermissionsForRoleResult = await updateApiPathPermissionsForRoleController(updateApiPathPermissionsForRoleFormModal.value);
		if (updateApiPathPermissionsForRoleResult.success) {
			await fetchAllDataInRolePage();
			closeEditRoleModal();
		} else
			dialog.error({
				title: "更新角色的 API 路径时出错",
				content: updateApiPathPermissionsForRoleResult.message,
				positiveText: "知道了",
			});
		isEditingRole.value = false;
	}

	/**
	 * 获取 role.vue 页面所有初始化数据
	 */
	async function fetchAllDataInRolePage() {
		await fetchRbacRole();
		await fetchRbacApiPath();
	}

	onMounted(fetchAllDataInRolePage);
</script>

<template>
	<div class="container">
		<PageHeading>KIRAKIRA RBAC 角色管理</PageHeading>
		<NCollapse class="mlb-4">
			<NCollapseItem title="使用说明">
				<NP>KIRAKIRA RBAC 权限控制的最小单位是 API 路径。</NP>
				<NUl>
					<NLi>一个用户可以拥有多个角色</NLi>
					<NLi>一个角色可以对应多位用户</NLi>
					<NLi>一个角色可以拥有对多个 API 的访问权限</NLi>
					<NLi>一个 API 可以对应多个角色</NLi>
				</NUl>
				<NP>
					你可以添加或删除角色。<br />
					拥有以下特殊名称的角色具有特殊效果，在创建、分配（绑定/解除绑定）和删除时请多加注意：
				</NP>
				<NUl>
					<NLi><b>root</b> - 拥有 RBAC 的管理权限</NLi>
					<NLi><b>adminsitrator</b> - 拥有对内容管理权限</NLi>
					<NLi><b>developer</b> - 拥有某些开发资源的访问权限</NLi>
					<NLi><b>user</b> - 普通用户</NLi>
					<NLi><b>blocked</b> - 已封禁的用户</NLi>
				</NUl>
			</NCollapseItem>
		</NCollapse>
		<NFlex class="mlb-2">
			<NButton @click="openCreateRoleModal"><template #icon><Icon name="add" /></template>新增</NButton>
		</NFlex>
		<NDataTable
			:columns="columns"
			:data="rbacRole"
			:pagination="false"
			:bordered="false"
			:resizable="true"
			:rowKey="row => row.roleName"
		/>
		<NFlex justify="end" class="mbs-4">
			<NPagination
				:displayOrder="['quick-jumper', 'pages', 'size-picker']"
				:pageCount="rbacRolePageCount"
				:page="pagination.page"
				:pageSize="pagination.pageSize"
				:pageSizes="pagination.pageSizes"
				:onUpdate:page="pagination.onChange"
				:onUpdate:pageSize="pagination.onUpdatePageSize"
				showQuickJumper
				showSizePicker
			/>
		</NFlex>

		<NModal
			v-model:show="isShowDeleteRoleModal"
			:maskClosable="false"
			preset="dialog"
			:title="`确认要删除角色 ${currentDeletingRole} 吗？`"
		>
			<NFormItem label="再次输入角色的名字来确定删除">
				<NInput v-model:value="userInputDeleteingRole" placeholder="角色名字" />
			</NFormItem>

			<template #action>
				<NButton @click="closeDeleteRoleModal">算了</NButton>
				<NButton :disabled="currentDeletingRole !== userInputDeleteingRole" :loading="isDeletingRole" type="warning" :secondary="true" @click="fetchDeleteRbacRole(currentDeletingRole)">确认删除</NButton>
			</template>
		</NModal>

		<NModal
			class="is-[600px]"
			v-model:show="isShowCreateNewRoleModal"
			:maskClosable="false"
			preset="card"
			title="创建新角色"
		>
			<NForm>
				<NFormItem label="角色的名字" :rule="{ required: true }">
					<NInput :status="!createRoleFormModal.roleName ? 'error' : 'success'" v-model:value="createRoleFormModal.roleName" placeholder="（必填）唯一且简短的角色名" />
				</NFormItem>
				<NFormItem label="角色的类型">
					<NInput v-model:value="createRoleFormModal.roleType" placeholder='用于标识角色，例如 "maintenance"' />
				</NFormItem>
				<NFormItem label="角色的显示颜色">
					<NFlex vertical :size="0" class="is-full">
						<small class="n-form-item-label text-xs min-bs-0">填写颜色可以更方便区分不同角色</small>
						<NColorPicker v-model:value="createRoleFormModal.roleColor" :modes="['hex']" :showAlpha="true" />
					</NFlex>
				</NFormItem>
				<NFormItem label="角色的介绍">
					<NInput v-model:value="createRoleFormModal.roleDescription" type="textarea" :autosize="{ minRows: 3 }" placeholder="角色的详细说明" />
				</NFormItem>
			</NForm>
			<template #footer>
				<NFlex class="justify-end">
					<NButton @click="closeCreateRoleModal">算了</NButton>
					<NButton :disabled="!createRoleFormModal?.roleName" :loading="isCreatingRole" type="primary" :secondary="true" @click="createRole">确认创建</NButton>
				</NFlex>
			</template>
		</NModal>

		<NModal
			class="is-[600px]"
			v-model:show="isShowEditRoleModal"
			:maskClosable="false"
			preset="card"
			title="编辑角色可以访问的 API 路径"
		>
			<NForm>
				<NFormItem label="角色的名字">
					<NInput :disabled="true" v-model:value="updateApiPathPermissionsForRoleFormModal.roleName" placeholder="角色名" />
				</NFormItem>
				<NFormItem label="角色可以访问的 API 路径">
					<NTransfer
						v-model:value="updateApiPathPermissionsForRoleFormModal.apiPathPermissions"
						:options="rbacApiPath?.map(apiPath => ({
							label: apiPath.apiPath,
							value: apiPath.apiPath,
						}))"
						sourceFilterable
						targetFilterable
					/>
				</NFormItem>
			</NForm>
			<template #footer>
				<NFlex class="justify-end">
					<NButton @click="closeEditRoleModal">算了</NButton>
					<NButton :disabled="!updateApiPathPermissionsForRoleFormModal.roleName" :loading="isEditingRole" type="primary" :secondary="true" @click="updateApiPathPermissionsForRole">确认更新角色</NButton>
				</NFlex>
			</template>
		</NModal>
	</div>
</template>
