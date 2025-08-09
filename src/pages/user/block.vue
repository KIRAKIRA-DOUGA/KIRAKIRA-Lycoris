<script setup lang="tsx">
	type UserList = GetBlockedUserResponseDto["result"];
	const message = useMessage();

	const isShowUnbanUserModal = ref(false);
	const isUnbanUser = ref(false);
	const currentUnbanUserInfo = ref<string>("");
	const userInputUnbanUserInfo = ref<string>("");

	const searchUserUid = ref<number | null>(null);
	const currentSortKey = ref<string | null>("uid");
	const currentSortOrder = ref<"ascend" | "descend" | undefined>("ascend");

	const columns = computed<DataTableColumns<NonNullable<UserList>[number]>>(() => [
		{
			title: "UID",
			key: "uid",
			sorter: "default",
			sortOrder: currentSortKey.value === "uid" ? currentSortOrder.value : false,
		},
		{
			title: "UUID",
			key: "UUID",
		},
		{
			title: "昵称",
			key: "userNickname",
			sorter: "default",
			sortOrder: currentSortKey.value === "userNickname" ? currentSortOrder.value : false,
		},
		{
			title: "用户名",
			key: "username",
		},
		{
			title: "邮箱",
			key: "email",
		},
		{
			title: "角色",
			key: "roles",
			render(row) {
				if (!row.roles?.length) return h(NTag, { style: { marginRight: "6px" }, type: "info", bordered: false }, { default: () => "user" });
				const roles = row.roles.map(roleKey => {
					return h(NTag, { style: { marginRight: "6px" }, type: "info", bordered: false }, { default: () => roleKey });
				});
				return roles;
			},
		},
		{
			title: "注册时间",
			key: "userCreateDateTime",
			sorter: "default",
			sortOrder: currentSortKey.value === "userCreateDateTime" ? currentSortOrder.value : false,
			render(row) {
				if (row.userCreateDateTime === undefined) return h(NText, { depth: 3 }, () => "未记录");
				const result = formatDateTime(row.userCreateDateTime);
				if (!result) return h(NText, { depth: 3 }, () => "未记录");
				return h("div", { class: "time-wrapper" }, [h("div", result.formatted),
				]);
			} },
		{
			title: "操作",
			key: "actions",
			render: row => (
				<NFlex>
					<NButton strong secondary size="small" type="success" onClick={() => openUnbanUserModal(row.UUID)}>{{ icon: () => <Icon name="check" /> }}</NButton>
				</NFlex>
			),
		},
	]);

	const userList = ref<UserList>([]);
	const userListCount = ref(0);
	const pagination = reactive({
		page: 1,
		pageSize: 50,
		showSizePicker: true,
		pageSizes: [5, 10, 20, 50, 100, 200],
		onChange: async (page: number) => {
			pagination.page = page;
			await getUserInfo();
		},
		onUpdatePageSize: async (pageSize: number) => {
			pagination.pageSize = pageSize;
			pagination.page = 1;
			await getUserInfo();
		},
	});
	const userListPageCount = computed(() => getPageCountByDataCount(userListCount.value, pagination.pageSize));

	/**
	 * 获取用户列表
	 */
	async function getUserInfo() {
		let apiSortBy: string | undefined = undefined;
		let apiSortOrder: "ascend" | "descend" | undefined = undefined;
		if (currentSortKey.value && currentSortOrder.value) {
			switch (currentSortKey.value) {
				case "uid":
					apiSortBy = "uid";
					break;
				case "userNickname":
					apiSortBy = "userNickname";
					break;
				case "userCreateDateTime":
					apiSortBy = "createDateTime";
					break;
				default:
					apiSortBy = "uid";
					break;
			}
			apiSortOrder = currentSortOrder.value;
		} else {
			apiSortBy = undefined;
			apiSortOrder = undefined;
		}
		const GetBlockedUserRequest: GetBlockedUserRequestDto = {
			uid: searchUserUid.value ?? -1,
			sortBy: apiSortBy ?? "uid",
			sortOrder: apiSortOrder ?? "ascend",
			pagination: {
				page: pagination.page,
				pageSize: pagination.pageSize,
			},
		};
		try {
			const getUserInfoResult = await adminGetBlockedUserInfo(GetBlockedUserRequest);
			if (getUserInfoResult.success) {
				userList.value = getUserInfoResult.result;
				userListCount.value = getUserInfoResult.totalCount ?? 0;
			} else
				console.error("ERROR", "获取用户列表失败。");
		} catch (error) {
			console.error("ERROR", "请求用户列表时出错:", error);
		}
	}

	/**
	 * 处理排序变化
	 * @param options 排序选项
	 */
	async function handleSorterChange(options: { columnKey: string | number | null; sorter: string; order: "ascend" | "descend" | undefined }) {
		currentSortKey.value = options.columnKey as string | null;
		currentSortOrder.value = options.order;
		pagination.page = 1;
		await getUserInfo();
	}

	/**
	 * 解封用户
	 */
	async function unbanUser() {
		if (userInputUnbanUserInfo.value === "") return;
		if (userInputUnbanUserInfo.value !== currentUnbanUserInfo.value) return;
		isUnbanUser.value = true;
		const unbanUserRequest: AdminUpdateUserRoleRequestDto = {
			uuid: currentUnbanUserInfo.value,
			uid: undefined as never,
			newRoles: ["user"],
		};
		const unbanUserResult = await adminUpdateUserRoleController(unbanUserRequest);
		if (unbanUserResult.success) {
			closeUnbanUserModal();
			message.success("解封用户成功");
			await getUserInfo();
		} else
			message.error("解封用户失败");
		isUnbanUser.value = false;
	}

	/**
	 * 更新正在解封的用户 UUID，并打开解封用户信息的表单
	 * @param banUUID 正在解封的用户信息
	 */
	function openUnbanUserModal(banUUID: string) {
		currentUnbanUserInfo.value = banUUID;
		isShowUnbanUserModal.value = true;
	}

	/**
	 * 关闭解封用户信息的表单，并清除正在解封的用户信息
	 */
	function closeUnbanUserModal() {
		isShowUnbanUserModal.value = false;
		currentUnbanUserInfo.value = "";
	}

	onMounted(() => { getUserInfo(); });
</script>

<template>
	<div class="container">
		<PageHeading>KIRAKIRA 封禁用户</PageHeading>
		<NSpace align="center" justify="space-between">
			<NCollapse class="mlb-4">
				<NCollapseItem title="使用说明">
					<NP>排序选项</NP>
					<NUl>
						<NLi>点击 UID、昵称、注册时间可以对表格排序</NLi>
						<NLi>再次点击可以切换“升序”及“降序”</NLi>
						<NLi>默认以 UID 升序排列</NLi>
					</NUl>
					<NP>点击解封按钮可以解封用户，输入用户的 UUID 来确认解封</NP>
					<NP>解封后，用户将恢复为普通用户</NP>
				</NCollapseItem>
			</NCollapse>
			<NFlex align="center" justify="right">
				<NInputNumber v-model:value="searchUserUid" placeholder="要查询的用户的 UID" :showButton="false" />
				<NButton @click="getUserInfo()"><template #icon><Icon name="search" /></template>查询</NButton>
			</NFlex>
		</NSpace>

		<NDataTable
			:columns="columns"
			:data="userList"
			:pagination="false"
			:bordered="false"
			:rowKey="row => row.uid"
			:remote="true"
			@update:sorter="handleSorterChange"
		/>
		<NFlex justify="end" class="mbs-4">
			<NPagination
				:displayOrder="['quick-jumper', 'pages', 'size-picker']"
				:pageCount="userListPageCount"
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
			v-model:show="isShowUnbanUserModal"
			:maskClosable="false"
			preset="dialog"
			:title="`确认要解封该用户吗？`"
		>
			<br />
			<NFormItem :label="`请输入用户的 UUID 来确定解封 ${currentUnbanUserInfo}`">
				<NInput v-model:value="userInputUnbanUserInfo" placeholder="用户 UUID" />
			</NFormItem>

			<template #action>
				<NButton @click="closeUnbanUserModal">算了</NButton>
				<NButton :disabled="currentUnbanUserInfo !== userInputUnbanUserInfo" :loading="isUnbanUser" type="warning" :secondary="true" @click="unbanUser()">确认解封</NButton>
			</template>
		</NModal>

	</div>
</template>
