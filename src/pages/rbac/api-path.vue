<script setup lang="tsx">
	const dialog = useDialog();

	type RbacApiPath = GetRbacApiPathResponseDto["result"];

	const isShowCreateNewApiPathModal = ref(false);
	const isCreatingApiPath = ref(false);
	const EMPTY_API_PATH_DATA = {
		apiPath: "",
		apiPathType: "",
		apiPathColor: "",
		apiPathDescription: "",
	};
	const createNewApiPathModal = ref<CreateRbacApiPathRequestDto>({ ...EMPTY_API_PATH_DATA });

	const isShowDeleteApiPathModal = ref(false);
	const isDeletingApiPath = ref(false);
	const currentDeletingApiPath = ref("");
	const userInputDeleteingApiPath = ref("");

	const columns: DataTableColumns<NonNullable<RbacApiPath>[number]> = [
		{
			title: "API 路径",
			key: "apiPath",
			render: row => {
				const color = row.isAssignedOnce && row.apiPathColor || "#EEEEEEFF";
				return <NTag color={{ color, textColor: getContrastiveColor(color) }}>{row.apiPath}</NTag>;
			},
		},
		{
			title: "是否至少绑定到一个身份",
			key: "isAssignedOnce",
			render: row => <div id={`${row.apiPath}-isAssignedOnce-col`}><Icon name={row.isAssignedOnce ? "check" : "close"} /></div>,
		},
		{
			title: "类型",
			key: "apiPathType",
		},
		{
			title: "显示颜色",
			key: "apiPathColor",
		},
		{
			title: "备注",
			key: "apiPathDescription",
		},
		{
			title: "操作",
			key: "actions",
			render: row => <NButton strong secondary size="small" type="error" onClick={() => openDeleteApiPathModal(row.apiPath ?? "")}>{{ icon: <Icon name="delete" /> }}</NButton>,
		},
	];

	const rbacApiPath = ref<RbacApiPath>([]);
	const rbacApiPathCount = ref(0);
	const pagination = reactive({
		page: 1,
		pageSize: 50,
		showSizePicker: true,
		pageSizes: [5, 10, 20, 50, 100, 200],
		onChange: async (page: number) => {
			pagination.page = page;
			await fetchRbacApiPath();
		},
		onUpdatePageSize: async (pageSize: number) => {
			pagination.pageSize = pageSize;
			pagination.page = 1;
			await fetchRbacApiPath();
		},
	});
	const rbacApiPathPageCount = computed(() => getPageCountByDataCount(rbacApiPathCount.value, pagination.pageSize));

	/**
	 * 获取 RBAC API 路径
	 */
	async function fetchRbacApiPath() {
		const getRbacApiPathRequest: GetRbacApiPathRequestDto = {
			search: {},
			pagination: {
				page: pagination.page,
				pageSize: pagination.pageSize,
			},
		};
		const rbacApiPathResult = await getRbacApiPathController(getRbacApiPathRequest);
		if (rbacApiPathResult.success) {
			rbacApiPath.value = rbacApiPathResult.result;
			rbacApiPathCount.value = rbacApiPathResult.count ?? 0;
		} else
			console.error("ERROR", "获取 RBAC API 路径失败。");
	}

	/**
	 * 更新正在删除的 API 路径名，并打开删除 API 路径的表单
	 * @param apiPathName 正在删除的 API 路径名
	 */
	function openDeleteApiPathModal(apiPahtName: string) {
		currentDeletingApiPath.value = apiPahtName;
		isShowDeleteApiPathModal.value = true;
	}

	/**
	 * 打开删除 API 路径的表单，并清除正在删除的 API 路径名
	 */
	function closeDeleteApiPathModal() {
		isShowDeleteApiPathModal.value = false;
		currentDeletingApiPath.value = "";
	}

	/**
	 * 删除 RBAC API 路径
	 * @param apiPath 要删除的 RBAC API 路径的名字
	 */
	async function deleteApiPath(apiPath: string) {
		const deleteRbacApiPathRequest: DeleteRbacApiPathRequestDto = {
			apiPath,
		};

		const deleteRbacApiPathResult = await deleteRbacApiPathController(deleteRbacApiPathRequest);

		if (!deleteRbacApiPathResult.success || deleteRbacApiPathResult.isAssigned)
			dialog.error({
				title: "删除 RBAC API 路径失败",
				content: deleteRbacApiPathResult.message,
				positiveText: "知道了",
			});
		else
			closeDeleteApiPathModal();

		await fetchRbacApiPath();
		isDeletingApiPath.value = false;
	}

	/**
	 * 清空表单数据并开启创建 API 路径的模态框
	 */
	function openCreateApiPathModal() {
		createNewApiPathModal.value = { ...EMPTY_API_PATH_DATA };
		isShowCreateNewApiPathModal.value = true;
	}

	/**
	 * 关闭创建 API 路径的模态框并清空表单数据
	 */
	function closeCreateApiPathModal() {
		isShowCreateNewApiPathModal.value = false;
		createNewApiPathModal.value = { ...EMPTY_API_PATH_DATA };
	}

	/**
	 * 提交表单，创建新的 API 路径
	 */
	async function createApiPath() {
		if (!createNewApiPathModal.value.apiPath) {
			console.error("ERROR", "创建 API 路径失败，参数不合法");
			return;
		}
		isCreatingApiPath.value = true;
		const createRbacApiPathResult = await createRbacApiPathController(createNewApiPathModal.value);

		await fetchRbacApiPath();
		if (createRbacApiPathResult.success)
			closeCreateApiPathModal();
		else
			dialog.error({
				title: "创建新的 API 路径失败",
				content: createRbacApiPathResult.message,
				positiveText: "知道了",
			});

		isCreatingApiPath.value = false;
	}
	onMounted(fetchRbacApiPath);
</script>

<template>
	<div class="container">
		<PageHeading>KIRAKIRA RBAC API 路径管理</PageHeading>
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
					你可以添加新的 API 路径，前提是后端中该 API 的 Controller 层受 RBAC 管制，否则添加 API 路径无效。<br />
					你也可以删除 API 路径，前提是该 API 路径没有绑定到任何身份。
				</NP>
				<NP>没有绑定到身份的 API 路径会显示为灰色，已经绑定到身份的 API 路径会显示用户设置的颜色。</NP>
			</NCollapseItem>
		</NCollapse>
		<NFlex class="mlb-2">
			<NButton @click="openCreateApiPathModal"><template #icon><Icon name="add" /></template>新增</NButton>
		</NFlex>
		<NDataTable
			:columns="columns"
			:data="rbacApiPath"
			:pagination="false"
			:bordered="false"
			:rowKey="row => row.apiPath"
		/>
		<NFlex justify="end" class="mbs-4">
			<NPagination
				:displayOrder="['quick-jumper', 'pages', 'size-picker']"
				:pageCount="rbacApiPathPageCount"
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
			class="is-[600px]"
			v-model:show="isShowCreateNewApiPathModal"
			:maskClosable="false"
			preset="card"
			title="创建新 API 路径"
		>
			<NForm>
				<NFormItem label="API 路径的名字" :rule="{ required: true }">
					<NInput :status="!createNewApiPathModal.apiPath ? 'error' : 'success'" v-model:value="createNewApiPathModal.apiPath" placeholder="（必填）唯一且简短的 API 路径名，例：/02/koa/hello" />
				</NFormItem>
				<NFormItem label="API 路径的类型">
					<NInput v-model:value="createNewApiPathModal.apiPathType" placeholder='用于标识 API 路径，例如 "video"' />
				</NFormItem>
				<NFormItem label="API 路径的显示颜色">
					<NFlex vertical :size="0" class="is-full">
						<small class="n-form-item-label text-xs min-bs-0">填写颜色可以更方便区分不同 API 路径</small>
						<NColorPicker v-model:value="createNewApiPathModal.apiPathColor" :modes="['hex']" :showAlpha="true" />
					</NFlex>
				</NFormItem>
				<NFormItem label="API 路径的介绍">
					<NInput v-model:value="createNewApiPathModal.apiPathDescription" type="textarea" :autosize="{ minRows: 3 }" placeholder="API 路径的详细说明" />
				</NFormItem>
			</NForm>
			<template #footer>
				<NFlex class="justify-end">
					<NButton @click="closeCreateApiPathModal">算了</NButton>
					<NButton :disabled="!createNewApiPathModal.apiPath" :loading="isCreatingApiPath" type="primary" :secondary="true" @click="createApiPath">确认创建</NButton>
				</NFlex>
			</template>
		</NModal>

		<NModal
			v-model:show="isShowDeleteApiPathModal"
			:maskClosable="false"
			preset="dialog"
			:title="`确认要删除 API 路径 ${currentDeletingApiPath} 吗？`"
		>

			<NFormItem label="再次输入 API 路径的名字来确定删除">
				<NInput v-model:value="userInputDeleteingApiPath" placeholder="API 路径名字" />
			</NFormItem>

			<template #action>
				<NButton @click="closeDeleteApiPathModal">算了</NButton>
				<NButton :disabled="currentDeletingApiPath !== userInputDeleteingApiPath" :loading="isDeletingApiPath" type="warning" :secondary="true" @click="deleteApiPath(currentDeletingApiPath)">确认删除</NButton>
			</template>
		</NModal>
	</div>
</template>
