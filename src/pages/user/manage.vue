<script setup lang="tsx">
	type UserList = AdminGetUserInfoResponseDto["result"];
	const message = useMessage();

	const isShowClearUserInfoModal = ref(false);
	const isShowEditUserInfoModal = ref(false);
	const isShowBanUserModal = ref(false);

	const isClearingUserInfo = ref(false);
	const isEditingUserInfo = ref(false);
	const isBanUser = ref(false);

	const currentClearingUserInfo = ref("");
	const userInputClearingUserInfo = ref("");
	const userInputBanUserInfo = ref("");
	const searchUserUid = ref<number | null>(null);
	const currentClearingUserInfoByUid = ref(0);
	const currentSortKey = ref<string | null>("uid");
	const currentSortOrder = ref<"ascend" | "descend" | false>("ascend");
	const currentBanUserInfo = ref("");
	const defaultEditUserInfoData = {
		uid: -1,
		UUID: "",
		email: "",
		userNickname: "",
		username: "",
		signature: "",
		gender: "",
		userBirthday: -1,
		userCreateDateTime: -1,
		isUpdatedAfterReview: false,
	};
	const editUserInfoData = reactive({ ...defaultEditUserInfoData });

	const options = [
		{
			label: "编辑",
			key: "editProfile",
			icon: () => <Icon name="edit" />,
		},
		{
			label: () => <span class="text-red-500">封禁</span>,
			key: "ban",
			icon: () => <Icon name="block" />,
		}];

	const handleSelect = (key: string, row: NonNullable<UserList>[number]) => {
		switch (key) {
			case "editProfile":
				refreshEditUserInfo(row);
				break;
			case "ban":
				openBanUserModal(row.UUID ?? "");
				break;

			default:
				break;
		}
	};

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
				<NSpace>
					<NDropdown options={options} trigger="click" placement="bottom-end" onSelect={(key: string) => handleSelect(key, row)}>
						<NButton strong secondary size="small" class="mie-2">{{ icon: <Icon name="moreHoriz" /> }}</NButton>
					</NDropdown>
					<NButton type="error" strong secondary size="small" class="mie-2" onClick={() => openClearUserInfoModal(row.UUID ?? "", row.uid ?? 0)}>{{ icon: <Icon name="delete" /> }}</NButton>
				</NSpace>
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

		const getUserListRequest: AdminGetUserInfoRequestDto = {
			isOnlyShowUserInfoUpdatedAfterReview: false,
			uid: searchUserUid.value ?? -1,
			sortBy: apiSortBy ?? "uid",
			sortOrder: apiSortOrder ?? "ascend",
			pagination: {
				page: pagination.page,
				pageSize: pagination.pageSize,
			},
		};

		try {
			const getUserInfoResult = await adminGetUserInfo(getUserListRequest);
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
	async function handleSorterChange(options: { columnKey: string | number | null; sorter: string; order: "ascend" | "descend" | false }) {
		currentSortKey.value = options.columnKey as string | null;
		currentSortOrder.value = options.order;
		pagination.page = 1;
		await getUserInfo();
	}

	/**
	 * 封禁用户
	 */
	async function banUser() {
		if (userInputBanUserInfo.value === "") return;
		if (userInputBanUserInfo.value !== currentBanUserInfo.value) return;
		isBanUser.value = true;
		const banUserRequest: AdminUpdateUserRoleRequestDto = {
			uuid: currentBanUserInfo.value,
			uid: undefined as never,
			newRoles: ["blocked"],
		};
		const banUserResult = await adminUpdateUserRoleController(banUserRequest);
		if (banUserResult.success) {
			closeBanUserModal();
			message.success("封禁用户成功");
			await getUserInfo();
		} else
			message.error("封禁用户失败");
		isBanUser.value = false;
	}

	/**
	 * 清空用户信息
	 */
	async function clearUserInfo() {
		if (currentClearingUserInfo.value === "") return;
		if (userInputClearingUserInfo.value !== currentClearingUserInfo.value) return;
		isClearingUserInfo.value = true;
		const clearUserInfoRequest: AdminClearUserInfoRequestDto = {
			uid: currentClearingUserInfoByUid.value,
		};
		const clearUserInfoResult = await adminClearUserInfo(clearUserInfoRequest);
		if (clearUserInfoResult.success) {
			closeClearUserInfoModal();
			message.success("清除用户信息成功");
			await getUserInfo();
		} else
			message.error("清除用户信息失败");
		isClearingUserInfo.value = false;
	}

	/**
	 * 编辑用户信息
	 */
	async function editUserInfo() {
		if (editUserInfoData.userNickname === "" || editUserInfoData.username === "") {
			message.error("昵称和用户名不能为空");
			isEditingUserInfo.value = false;
		}
		isEditingUserInfo.value = true;
		const editUserInfoRequest: AdminEditUserInfoRequestDto = {
			uid: editUserInfoData.uid,
			userInfo: {
				userNickname: editUserInfoData.userNickname,
				username: editUserInfoData.username,
				signature: editUserInfoData.signature ?? "",
				userBirthday: editUserInfoData.userBirthday ?? -1,
				gender: editUserInfoData.gender,
				isUpdatedAfterReview: editUserInfoData.isUpdatedAfterReview,
			},
		};
		const editUserInfoResult = await adminEditUserInfo(editUserInfoRequest);
		if (editUserInfoResult.success) {
			message.success("修改用户信息成功");
			closeEditUserInfoModal();
			await getUserInfo();
		} else {
			message.error("修改用户信息失败");
			isEditingUserInfo.value = false;
		}
	}

	/**
	 * 刷新编辑用户信息
	 */
	function refreshEditUserInfo(row: NonNullable<UserList>[number]) {
		if (!row) return;
		Object.assign(editUserInfoData, {
			uid: row.uid,
			UUID: row.UUID,
			email: row.email,
			userNickname: row.userNickname,
			username: row.username,
			signature: row.signature,
			userBirthday: row.userBirthday,
			gender: row.gender,
			isUpdatedAfterReview: row.isUpdatedAfterReview,
		});
		isShowEditUserInfoModal.value = true;
	}

	/**
	 * 更新正在删除的用户 UUID，并打开删除用户信息的表单
	 * @param deleteUUID 正在删除的用户信息
	 */
	function openClearUserInfoModal(clearUUID: string, clearUid: number) {
		currentClearingUserInfo.value = clearUUID;
		currentClearingUserInfoByUid.value = clearUid;
		isShowClearUserInfoModal.value = true;
	}

	/**
	 * 关闭删除用户信息的表单，并清除正在删除的用户信息
	 */
	function closeClearUserInfoModal() {
		isShowClearUserInfoModal.value = false;
		currentClearingUserInfo.value = "";
	}

	/**
	 * 更新正在封禁的用户 UUID，并打开封禁用户信息的表单
	 * @param banUUID 正在封禁的用户信息
	 */
	function openBanUserModal(banUUID: string) {
		currentBanUserInfo.value = banUUID;
		isShowBanUserModal.value = true;
	}

	/**
	 * 关闭封禁用户信息的表单，并清除正在封禁的用户信息
	 */
	function closeBanUserModal() {
		isShowBanUserModal.value = false;
		currentBanUserInfo.value = "";
	}

	/**
	 * 关闭编辑用户信息的表单，并清除正在编辑的用户信息
	 */
	function closeEditUserInfoModal() {
		isShowEditUserInfoModal.value = false;
		isEditingUserInfo.value = false;
	}

	onMounted(() => { getUserInfo(); });
</script>

<template>
	<div class="container">
		<PageHeading>KIRAKIRA 用户管理</PageHeading>
		<NSpace align="center" justify="space-between">
			<NCollapse class="mlb-4">
				<NCollapseItem title="使用说明">
					<NP>排序选项</NP>
					<NUl>
						<NLi>点击 UID, 昵称, 注册时间可以对表格排序</NLi>
						<NLi>再次点击可以切换“升序”及“降序”</NLi>
						<NLi>默认以 UID 升序排列</NLi>
					</NUl>
					<NP>操作</NP>
					<NUl>
						<NLi>点击编辑按钮可以编辑用户信息，输入用户的 UUID 来确认编辑</NLi>
						<NLi>点击封禁按钮可以封禁用户，输入用户的 UUID 来确认封禁</NLi>
						<NLi>点击删除按钮可以删除用户信息，输入用户的 UUID 来确认删除</NLi>
					</NUl>
					<NP>在编辑页面里你可以编辑用户的信息<br />但在修改前请慎重考虑是否符合规范</NP>
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
			v-model:show="isShowEditUserInfoModal"
			:maskClosable="false"
			preset="dialog"
			title="用户信息"
			:style="{ width: '800px' }"
		>
			<br />
			<NAlert type="warning" title="注意"><div>修改请慎重！</div></NAlert>
			<br />
			<NForm labelPlacement="left" labelWidth="100px">
				<NRow :gutter="24">

					<NCol :span="10">
						<NFormItem label="UID">
							<NInput :value="String(editUserInfoData.uid)" disabled />
						</NFormItem>
						<NFormItem label="邮箱">
							<NInput :value="editUserInfoData.email" disabled />
						</NFormItem>
						<NFormItem label="昵称">
							<NInput v-model:value="editUserInfoData.userNickname" />
						</NFormItem>
						<NFormItem label="出生日期">
							<NDatePicker
								v-model:value="editUserInfoData.userBirthday"
								type="date"
								style="width: 100%"
							/>
						</NFormItem>

					</NCol>

					<NCol :span="14">
						<NFormItem label="UUID">
							<NInput :value="editUserInfoData.UUID" disabled />
						</NFormItem>
						<NFormItem label="用户名">
							<NInput v-model:value="editUserInfoData.username" />
						</NFormItem>
						<NFormItem label="简介">
							<NInput
								v-model:value="editUserInfoData.signature"
								type="textarea"
								:autosize="{ minRows: 3, maxRows: 5 }"
							/>
						</NFormItem>
					</NCol>
				</NRow>

				<NRow :gutter="24">
					<NCol :span="12">
						<NFormItem label="性别">
							<NRadioGroup v-model:value="editUserInfoData.gender">
								<NSpace>
									<NRadio value="male">男</NRadio>
									<NRadio value="female">女</NRadio>
								</NSpace>
							</NRadioGroup>
						</NFormItem>
					</NCol>
					<NCol :span="12">
						<NFormItem label="是否未审核">
							<NSwitch v-model:value="editUserInfoData.isUpdatedAfterReview" />
						</NFormItem>
					</NCol>
				</NRow>
			</NForm>

			<template #action>
				<NButton @click="closeEditUserInfoModal">放弃更改</NButton>
				<NPopconfirm
					@negativeClick="message.info(`$(editUserInfoData.userBirthday)`)"
					@positiveClick="editUserInfo()"
				>
					<template #trigger>
						<NButton
							:disabled="editUserInfoData.email === '' || editUserInfoData.userNickname === '' || editUserInfoData.username === ''"
							:loading="isEditingUserInfo"
							type="warning"
							:secondary="true"
						>
							保存
						</NButton>
					</template>
					你确定要保存吗？
				</NPopconfirm>
			</template>
		</NModal>

		<NModal
			v-model:show="isShowClearUserInfoModal"
			:maskClosable="false"
			preset="dialog"
			:title="`确认要删除该用户信息吗？`"
		>
			<br />
			<NFormItem :label="`请输入用户的UUID来确定删除 ${currentClearingUserInfo}`">
				<NInput v-model:value="userInputClearingUserInfo" placeholder="用户 UUID" />
			</NFormItem>

			<template #action>
				<NButton @click="closeClearUserInfoModal">算了</NButton>
				<NButton :disabled="currentClearingUserInfo !== userInputClearingUserInfo" :loading="isClearingUserInfo" type="warning" :secondary="true" @click="clearUserInfo()">确认删除</NButton>
			</template>
		</NModal>

		<NModal
			v-model:show="isShowBanUserModal"
			:maskClosable="false"
			preset="dialog"
			:title="`确认要封禁该用户吗？`"
		>
			<br />
			<NFormItem :label="`请输入用户的UUID来确定封禁 ${currentBanUserInfo}`">
				<NInput v-model:value="userInputBanUserInfo" placeholder="用户 UUID" />
			</NFormItem>

			<template #action>
				<NButton @click="closeBanUserModal">算了</NButton>
				<NButton :disabled="currentBanUserInfo !== userInputBanUserInfo" :loading="isBanUser" type="warning" :secondary="true" @click="banUser()">确认封禁</NButton>
			</template>
		</NModal>

	</div>
</template>
