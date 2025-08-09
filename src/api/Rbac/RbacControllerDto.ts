/**
 * 通过 RBAC 检查用户的权限的参数
 */
export type CheckUserRbacParams =
	| { uuid: string; apiPath: string }
	| { uid: number; apiPath: string };

/**
 * 通过 RBAC 检查用户的权限的结果
 */
export type CheckUserRbacResult = {
	status: 200 | 403 | 500;
	message: string;
};

/**
 * RBAC API 路径
 */
type RbacApiPath = {
	/** API 路径的 UUID - 非空 - 唯一 */
	apiPathUuid: string;
	/** API 路径 - 非空 - 唯一 */
	apiPath: string;
	/** API 路径的类型 */
	apiPathType?: string;
	/** API 路径的颜色 - 例子：#66CCFFFF */
	apiPathColor?: string;
	/** API 路径的描述 */
	apiPathDescription?: string;
	/** API 路径创建者 - 非空 */
	creatorUuid: string;
	/** API 路径最后更新者 - 非空 */
	lastEditorUuid: string;
	/** 系统专用字段-创建时间 - 非空 */
	createDateTime: number;
	/** 系统专用字段-最后编辑时间 - 非空 */
	editDateTime: number;
};

/**
 * RBAC API 路径的结果
 */
type RbacApiPathResult = RbacApiPath & {
	/** 该路径是否已经被分配了至少一次 */
	isAssignedOnce: boolean;
};

/**
 * 创建 RBAC API 路径的请求载荷
 */
export type CreateRbacApiPathRequestDto = {
	/** API 路径*/
	apiPath: string;
	/** API 路径的类型 */
	apiPathType?: string;
	/** API 路径的颜色 - 例子：#66CCFFFF */
	apiPathColor?: string;
	/** API 路径的描述 */
	apiPathDescription?: string;
};

/**
 * 创建 RBAC API 路径的请求响应
 */
export type CreateRbacApiPathResponseDto = {
	/** 是否请求成功 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 如果成功，返回创建的数据 */
	result?: RbacApiPathResult;
};

/**
 * 删除 RBAC API 路径的请求载荷
 */
export type DeleteRbacApiPathRequestDto = {
	/** API 路径*/
	apiPath: string;
};

/**
 * 删除 RBAC API 路径的请求响应
 */
export type DeleteRbacApiPathResponseDto = {
	/** 是否请求成功 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 该 API 路径是否已经绑定到身份（如果绑定了身份则无法删除） */
	isAssigned: boolean;
};

/**
 * 获取 API 路径的请求载荷
 */
export type GetRbacApiPathRequestDto = {
	/** 搜索项 */
	search: {
		/** API 路径*/
		apiPath?: string;
		/** API 路径的类型 */
		apiPathType?: string;
		/** API 路径的颜色 - 例子：#66CCFFFF */
		apiPathColor?: string;
		/** API 路径的描述 */
		apiPathDescription?: string;
	};
	/** 分页查询 */
	pagination: {
		/** 当前在第几页 */
		page: number;
		/** 一页显示多少条 */
		pageSize: number;
	};
};

/**
 * 获取 API 路径的请求响应
 */
export type GetRbacApiPathResponseDto = {
	/** 是否请求成功 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 如果成功，返回数据 */
	result?: RbacApiPathResult[];
	/** 如果成功，返回合计数据 */
	count?: number;
};

/**
 * RBAC 身份
 */
type RbacRole = {
	/** 身份的 UUID */
	roleUuid: string;
	/** 身份的名字 */
	roleName: string;
	/** 身份的类型 */
	roleType?: string;
	/** 身份的颜色 - 例子：#66CCFFFF */
	roleColor?: string;
	/** 身份的描述 */
	roleDescription?: string;
	/** 这个身份有哪些 API 路径的访问权 */
	apiPathPermissions: string[];
	/** API 路径创建者 - 非空 */
	creatorUuid: string;
	/** API 路径最后更新者 - 非空 */
	lastEditorUuid: string;
	/** 系统专用字段-创建时间 - 非空 */
	createDateTime: number;
	/** 系统专用字段-最后编辑时间 - 非空 */
	editDateTime: number;
};

/**
 * 创建 RBAC 身份的请求载荷
 */
export type CreateRbacRoleRequestDto = {
	/** 身份的名字 */
	roleName: string;
	/** 身份的类型 */
	roleType?: string;
	/** 身份的颜色 - 例子：#66CCFFFF */
	roleColor?: string;
	/** 身份的描述 */
	roleDescription?: string;
};

/**
 * 创建 RBAC 身份的请求响应
 */
export type CreateRbacRoleResponseDto = {
	/** 是否请求成功 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 如果成功，返回创建的数据 */
	result?: RbacRole;
};

/**
 * 删除 RBAC 身份的请求载荷
 */
export type DeleteRbacRoleRequestDto = {
	/** 身份的名字 */
	roleName: string;
};

/**
 * 删除 RBAC 身份的请求响应
 */
export type DeleteRbacRoleResponseDto = {
	/** 是否请求成功 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
};

/**
 * 获取 RBAC 身份的请求载荷
 */
export type GetRbacRoleRequestDto = {
	/** 搜索项 */
	search: {
		/** 身份的名字 */
		roleName?: string;
		/** 身份的类型 */
		roleType?: string;
		/** 身份的颜色 - 例子：#66CCFFFF */
		roleColor?: string;
		/** 身份的描述 */
		roleDescription?: string;
	};
	/** 分页查询 */
	pagination: {
		/** 当前在第几页 */
		page: number;
		/** 一页显示多少条 */
		pageSize: number;
	};
};

/**
 * 获取 RBAC 身份的请求响应
 */
export type GetRbacRoleResponseDto = {
	/** 是否请求成功 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 如果成功，返回数据 */
	result?: (
		& RbacRole
		& { apiPathList: RbacApiPathResult[] }
	)[];
	/** 如果成功，返回合计数据 */
	count?: number;
};

/**
 * 为身份更新 API 路径权限的请求载荷
 */
export type UpdateApiPathPermissionsForRoleRequestDto = {
	/** 身份的名字 */
	roleName: string;
	/** 这个身份有哪些 API 路径的访问权 */
	apiPathPermissions: string[];
};

/**
 * 为身份更新 API 路径权限的请求响应
 */
export type UpdateApiPathPermissionsForRoleResponseDto = {
	/** 是否请求成功 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 如果成功，返回数据 */
	result?: RbacRole;
};

/**
 * 通过 UID 获取一个用户的身份的请求载荷
 */
export type AdminGetUserRolesByUidRequestDto = {
	/** 用户的 UID */
	uid: number;
};

/**
 * 通过 UID 获取一个用户的身份的请求响应
 */
export type AdminGetUserRolesByUidResponseDto = {
	/** 是否请求成功 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 如果成功，返回数据 */
	result?: {
		/** 用户的 UID */
		uid: number;
		/** 用户的 UUID */
		uuid: string;
		/** 用户名 */
		username: string;
		/** 用户昵称 */
		userNickname: string;
		/** 用户头像 */
		avatar: string;
		/** 用户的身份 */
		roles: RbacRole[];
	};
};

/**
 * 管理员使用 UUID 更新用户身份
 */
type AdminUpdateUserRoleByUUID = {
	/** 要被更新身份的用户的 UUID，不带有 UID */
	uuid: string;
	uid: never;
	/** 新的身份 */
	newRoles: string[];
};

/**
 * 管理员使用 UID 更新用户身份
 */
type AdminUpdateUserRoleByUID = {
	/** 要被更新身份的用户的 UID，不带有 UUID */
	uid: number;
	uuid: never;
	/** 新的身份 */
	newRoles: string[];
};

/**
 * 管理员更新用户身份的请求载荷
 */
export type AdminUpdateUserRoleRequestDto = AdminUpdateUserRoleByUUID | AdminUpdateUserRoleByUID;

/**
 * 管理员更新用户身份的请求响应
 */
export type AdminUpdateUserRoleResponseDto = {
	/** 是否请求成功 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
};
