<script setup lang="tsx">
	type UserList = AdminGetUserInfoResponseDto["result"];
	const message = useMessage();

	const isOpenUserInfoModal = ref(false);
	const isPassUser = ref(false);
	const isDeleteUser = ref(false);
	const searchUserUid = ref<number | null>(null);
	const currentSortKey = ref<string | null>("uid");
	const currentSortOrder = ref<"ascend" | "descend" | undefined>("ascend");
	const defaultUserInfoData = {
		uid: -1,
		avatar: "",
		userBannerImage: "",
		userNickname: "",
		username: "",
		gender: "",
		signature: "",
		label: [],
	};
	const userInfoData = reactive({ ...defaultUserInfoData });
	const genderMap: Record<string, string> = {
		male: "男",
		female: "女",
		unknown: "未知",
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
				<NFlex>
					<NButton strong secondary size="small" type="info" onClick={() => openUserInfoModal(row)}>{{ icon: () => <Icon name="description" /> }}</NButton>
					<NPopconfirm onPositiveClick={() => clearUserInfo(row.uid)}>
						{{
							trigger: <NButton type="error" strong secondary size="small">{{ icon: <Icon name="delete" /> }}</NButton>,
							default: "确认驳回该用户修改信息审核吗？",
						}}
					</NPopconfirm>
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
		let apiSortBy: string | undefined;
		let apiSortOrder: "ascend" | "descend" | undefined;
		if (currentSortKey.value && currentSortOrder.value)
			apiSortBy = ["uid", "userNickname"].includes(currentSortKey.value) ? currentSortKey.value :
				currentSortKey.value === "userCreateDateTime" ? "createDateTime" : "uid";
		else
			apiSortBy = apiSortOrder = undefined;

		const getUserListRequest: AdminGetUserInfoRequestDto = {
			isOnlyShowUserInfoUpdatedAfterReview: true,
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
	async function handleSorterChange(options: { columnKey: string | number | null; sorter: string; order: "ascend" | "descend" | undefined }) {
		currentSortKey.value = options.columnKey as string | null;
		currentSortOrder.value = options.order;
		pagination.page = 1;
		await getUserInfo();
	}

	/**
	 * 清空用户信息
	 */
	async function clearUserInfo(uid: number) {
		isDeleteUser.value = true;
		const clearUserInfoRequest: AdminClearUserInfoRequestDto = {
			uid,
		};
		const clearUserInfoResult = await adminClearUserInfo(clearUserInfoRequest);
		if (clearUserInfoResult.success) {
			message.success("清除用户信息成功");
			isOpenUserInfoModal.value = false;
			await getUserInfo();
		} else
			message.error("清除用户信息失败");
		isDeleteUser.value = false;
	}

	/**
	 * 处理用户信息
	 */
	function handleUserInfo(userData: NonNullable<UserList>[number]) {
		Object.assign(userInfoData, {
			uid: userData.uid,
			avatar: userData.avatar,
			userBannerImage: userData.userBannerImage,
			username: userData.username,
			userNickname: userData.userNickname,
			signature: userData.signature,
			gender: userData.gender,
			label: userData.label,
		});
	}

	/**
	 * 通过用户审核
	 */
	async function passUserInfo() {
		isPassUser.value = true;
		const passUserInfoRequest: AdminEditUserInfoRequestDto = {
			uid: userInfoData.uid,
			userInfo: {
				isUpdatedAfterReview: false,
			},
		};
		const passUserInfoResult = await adminEditUserInfo(passUserInfoRequest);
		if (passUserInfoResult.success) {
			message.success("通过用户信息成功");
			isOpenUserInfoModal.value = false;
			await getUserInfo();
		} else
			message.error("通过用户信息失败");
		isPassUser.value = false;
	}

	/**
	 * 设置数据并打开用户信息的模态框
	 */
	function openUserInfoModal(userData: NonNullable<UserList>[number]) {
		isOpenUserInfoModal.value = true;
		handleUserInfo(userData);
	}

	onMounted(() => { getUserInfo(); });
</script>

<template>
	<div class="container">
		<PageHeading>KIRAKIRA 最近更改用户</PageHeading>
		<NSpace align="center" justify="space-between">
			<NCollapse class="mlb-4">
				<NCollapseItem title="使用说明">
					<NP>排序选项</NP>
					<NUl>
						<NLi>点击 UID, 昵称, 注册时间可以对表格排序</NLi>
						<NLi>再次点击可以切换“升序”及“降序”</NLi>
						<NLi>默认以 UID 升序排列</NLi>
					</NUl>
					<NP>点击通过按钮可以通过用户信息，输入用户的 UUID 来确认通过<br />通过后，用户将恢复为普通用户</NP>
					<NP>点击清除按钮可以清除用户信息，输入用户的 UID 来确认清除<br />清除后，用户信息将被清除</NP>
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
		<div class="flex justify-end mt-4">
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
		</div>

		<NModal
			v-model:show="isOpenUserInfoModal"
			:maskClosable="false"
			preset="dialog"
			title="用户信息"
			:style="{ width: '700px' }"
		>
			<br />
			<NImage
				width="100%"
				height="120"
				:src="userInfoData.userBannerImage || '/assets/default-bannar.png'"
				class="object-cover rounded-md"
			/>

			<div class="flex items-center mt-4">
				<NAvatar
					round
					:size="50"
					:src="userInfoData.avatar || '/assets/avatar.svg#person'"
				/>
				<div class="ml-3 flex-1">
					<div class="font-bold">
						{{ userInfoData.userNickname }}
						<span class="text-gray-500">@{{ userInfoData.username }}</span>
					</div>
				</div>
				<div class="whitespace-nowrap">
					性别：{{ genderMap[userInfoData.gender] || '未知' }}
				</div>
			</div>

			<div class="mt-4">
				<div class="font-bold mb-2">用户简介</div>
				<div class="min-h-[80px] bg-gray-100 p-2 rounded-md">
					{{ userInfoData.signature || '暂无简介' }}
				</div>
			</div>

			<div class="mt-4">
				<div class="font-bold mb-2">用户标签</div>
				<div class="flex flex-wrap gap-2">
					<NTag
						v-for="(tag, index) in (userInfoData.label || [])"
						:key="index"
						type="default"
						size="small"
					>
						{{ tag }}
					</NTag>
					<span v-if="(userInfoData.label || []).length === 0"><NTag size="small" type="info">暂无标签</NTag></span>
				</div>
			</div>

			<div style="margin-top: 24px; text-align: right">
				<NPopconfirm @positiveClick="clearUserInfo(userInfoData.uid)">
					<template #trigger>
						<NButton type="error" :loading="isDeleteUser" style="margin-right: 8px"><Icon name="delete" /></NButton>
					</template>
					确认驳回该用户修改信息审核吗？
				</NPopconfirm>
				<NButton type="success" :loading="isPassUser" @click="passUserInfo()"><Icon name="check" /></NButton>
			</div>
		</NModal>
	</div>
</template>
