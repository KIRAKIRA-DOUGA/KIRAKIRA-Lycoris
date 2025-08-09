import { AdminGetUserRolesByUidRequestDto, AdminGetUserRolesByUidResponseDto, AdminUpdateUserRoleRequestDto, AdminUpdateUserRoleResponseDto, CreateRbacApiPathRequestDto, CreateRbacApiPathResponseDto, CreateRbacRoleRequestDto, CreateRbacRoleResponseDto, DeleteRbacApiPathRequestDto, DeleteRbacApiPathResponseDto, DeleteRbacRoleRequestDto, DeleteRbacRoleResponseDto, GetRbacApiPathRequestDto, GetRbacApiPathResponseDto, GetRbacRoleRequestDto, GetRbacRoleResponseDto, UpdateApiPathPermissionsForRoleRequestDto, UpdateApiPathPermissionsForRoleResponseDto } from "./RbacControllerDto";

const RBAC_API_URI = `${backendUri}rbac`;

/**
 * 获取 RBAC API 路径
 * @param getRbacApiPathRequest 获取 RBAC API 路径的请求载荷
 * @returns RBAC API 路径
 */
export const getRbacApiPathController = async (getRbacApiPathRequest: GetRbacApiPathRequestDto): Promise<GetRbacApiPathResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await GET(`${RBAC_API_URI}/getRbacApiPath${getUrlQuery({ ...getRbacApiPathRequest.search, ...getRbacApiPathRequest.pagination })}`, { credentials: "include" }) as GetRbacApiPathResponseDto;
};

/**
 * 删除 RBAC API 路径
 * @param deleteRbacApiPathRequest 删除 RBAC API 路径的请求载荷
 * @returns 删除结果
 */
export const deleteRbacApiPathController = async (deleteRbacApiPathRequest: DeleteRbacApiPathRequestDto): Promise<DeleteRbacApiPathResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await DELETE(`${RBAC_API_URI}/deleteRbacApiPath`, deleteRbacApiPathRequest, { credentials: "include" }) as DeleteRbacApiPathResponseDto;
};

/**
 * 创建 RBAC API 路径
 * @param createRbacApiPathRequest 创建 RBAC API 路径的请求载荷
 * @returns 创建 RBAC API 路径的请求响应
 */
export const createRbacApiPathController = async (createRbacApiPathRequest: CreateRbacApiPathRequestDto): Promise<CreateRbacApiPathResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await POST(`${RBAC_API_URI}/createRbacApiPath`, createRbacApiPathRequest, { credentials: "include" }) as CreateRbacApiPathResponseDto;
};

/**
 * 获取 RBAC 身份
 * @param getRbacRoleRequest 获取 RBAC 身份的请求载荷
 * @returns RBAC 身份
 */
export const getRbacRoleController = async (getRbacRoleRequest: GetRbacRoleRequestDto): Promise<GetRbacRoleResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await GET(`${RBAC_API_URI}/getRbacRole${getUrlQuery({ ...getRbacRoleRequest.search, ...getRbacRoleRequest.pagination })}`, { credentials: "include" }) as GetRbacRoleResponseDto;
};

/**
 * 删除 RBAC 身份
 * @param deleteRbacRoleRequest 删除 RBAC 身份的请求载荷
 * @returns 删除结果
 */
export const deleteRbacRoleController = async (deleteRbacRoleRequest: DeleteRbacRoleRequestDto): Promise<DeleteRbacRoleResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await DELETE(`${RBAC_API_URI}/deleteRbacRole`, deleteRbacRoleRequest, { credentials: "include" }) as DeleteRbacRoleResponseDto;
};

/**
 * 创建 RBAC 身份
 * @param createRbacRoleRequest 创建 RBAC 身份的请求载荷
 * @returns 创建 RBAC 身份的请求响应
 */
export const createRbacRoleController = async (createRbacRoleRequest: CreateRbacRoleRequestDto): Promise<CreateRbacRoleResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await POST(`${RBAC_API_URI}/createRbacRole`, createRbacRoleRequest, { credentials: "include" }) as CreateRbacRoleResponseDto;
};

/**
 * 为身份更新 API 路径权限
 * @param updateApiPathPermissionsForRoleRequest 为身份更新 API 路径权限的请求载荷
 * @returns 为身份更新 API 路径权限的请求响应
 */
export const updateApiPathPermissionsForRoleController = async (updateApiPathPermissionsForRoleRequest: UpdateApiPathPermissionsForRoleRequestDto): Promise<UpdateApiPathPermissionsForRoleResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await POST(`${RBAC_API_URI}/updateApiPathPermissionsForRole`, updateApiPathPermissionsForRoleRequest, { credentials: "include" }) as UpdateApiPathPermissionsForRoleResponseDto;
};

/**
 * 通过 UID 获取一个用户的身份
 * @param adminGetUserRolesByUidRequest 通过 UID 获取一个用户的身份的请求载荷
 * @returns 通过 UID 获取一个用户的身份的请求响应
 */
export const adminGetUserRolesController = async (adminGetUserRolesByUidRequest: AdminGetUserRolesByUidRequestDto): Promise<AdminGetUserRolesByUidResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await GET(`${RBAC_API_URI}/adminGetUserRolesByUid?uid=${adminGetUserRolesByUidRequest.uid}`, { credentials: "include" }) as AdminGetUserRolesByUidResponseDto;
};

/**
 * 管理员更新用户身份
 * @param adminUpdateUserRoleRequest 管理员更新用户身份的请求载荷
 * @returns 管理员更新用户身份的请求响应
 */
export const adminUpdateUserRoleController = async (adminUpdateUserRoleRequest: AdminUpdateUserRoleRequestDto): Promise<AdminUpdateUserRoleResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await POST(`${RBAC_API_URI}/adminUpdateUserRole`, adminUpdateUserRoleRequest, { credentials: "include" }) as AdminUpdateUserRoleResponseDto;
};
