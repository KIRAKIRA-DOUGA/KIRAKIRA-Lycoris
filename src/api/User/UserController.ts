import { GET, POST } from "api/tools/fetch";
import { GetSelfUserInfoRequestDto, GetSelfUserInfoResponseDto, CheckUserTokenResponseDto, UserLogoutResponseDto, UserLoginRequestDto, UserLoginResponseDto, GetBlockedUserRequestDto } from "./UserControllerDto";

const USER_API_URI = `${backendUri}user`;

/**
 * 用户登录
 * @param userLoginRequest 用户登录提交的参数
 * @returns 用户登录的返回参数
 */
export const userLogin = async (userLoginRequest: UserLoginRequestDto): Promise<UserLoginResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await POST(`${USER_API_URI}/login`, userLoginRequest, { credentials: "include" }) as UserLoginResponseDto;
};

/**
 * 获取当前登录的用户信息，前提是 token 中包含正确的 uid 和 token，同时丰富全局变量中的用户信息
 * @param getSelfUserInfoRequest 获取当前登录的用户信息的请求参数
 * @param usePinia 请求结果是否注入到 Pinia
 * @returns 用户信息
 */
export const getSelfUserInfo = async (getSelfUserInfoRequest?: GetSelfUserInfoRequestDto, usePinia: boolean = true): Promise<GetSelfUserInfoResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	const selfUserInfo = await POST(`${USER_API_URI}/self`, getSelfUserInfoRequest, { credentials: "include" }) as GetSelfUserInfoResponseDto;
	const selfUserInfoResult = selfUserInfo.result;
	if (selfUserInfo.success && selfUserInfoResult) {
		if (usePinia) {
			const selfUserInfoStore = useSelfUserInfoStore();
			selfUserInfoStore.isLogined = true;
			selfUserInfoStore.uid = selfUserInfoResult.uid;
			selfUserInfoStore.userCreateDateTime = selfUserInfoResult.userCreateDateTime ?? 0;
			selfUserInfoStore.roles = selfUserInfoResult.roles ?? ["user"];
			selfUserInfoStore.userEmail = selfUserInfoResult.email ?? "";
			selfUserInfoStore.userAvatar = selfUserInfoResult.avatar || "";
			selfUserInfoStore.username = selfUserInfoResult.username || "Anonymous"; // TODO: 使用多语言，为未设置用户名的用户提供国际化的缺省用户名
			selfUserInfoStore.userNickname = selfUserInfoResult.userNickname || ""; // TODO: 使用多语言，为未设置用户昵称的用户提供国际化的缺省用户昵称
			selfUserInfoStore.gender = selfUserInfoResult.gender || "";
			selfUserInfoStore.signature = selfUserInfoResult.signature || "";
			selfUserInfoStore.tags = selfUserInfoResult.label?.map(label => label.labelName) || [];
		}
	} else
		await userLogout(usePinia);
	return selfUserInfo;
};

/**
 * 校验用户 token 是否合法，同时可以验证用户是否已经登录
 * @returns 用户信息
 */
export const checkUserToken = async (): Promise<CheckUserTokenResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await GET(`${USER_API_URI}/check`, { credentials: "include" }) as CheckUserTokenResponseDto;
};

/**
 * 用户登出
 * @param usePinia 是否清空 Pinia
 * @returns 什么也不返回，但是会携带立即清除的 cookie 并覆盖原本的 cookie，同时将全局变量中的用户信息置空
 */
export async function userLogout(usePinia: boolean = true): Promise<UserLogoutResponseDto> {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	const logoutResult = await GET(`${USER_API_URI}/logout`, { credentials: "include" }) as UserLogoutResponseDto;
	if (logoutResult.success) {
		if (usePinia) {
			const selfUserInfoStore = useSelfUserInfoStore();
			selfUserInfoStore.isLogined = false;
			selfUserInfoStore.uid = undefined;
			selfUserInfoStore.userCreateDateTime = 0;
			selfUserInfoStore.roles = ["user"];
			selfUserInfoStore.userEmail = "";
			selfUserInfoStore.userAvatar = "";
			selfUserInfoStore.username = "";
			selfUserInfoStore.userNickname = "";
			selfUserInfoStore.gender = "";
			selfUserInfoStore.signature = "";
			selfUserInfoStore.tags = [];
		}
	} else
		console.error("ERROR", "用户登出失败"); // TODO: 使用多语言
	return logoutResult;
}

/**
 * 管理员获取用户信息
 * @param isOnlyShowUserInfoUpdatedAfterReview 是否只展示在上一次审核通过后修改了用户信息的用户
 * @param sortBy 以此排序
 * @param sortOrder 以此排序的顺序，可选的值：{ascend: 升序, descend: 降序}
 * @param page 当前在第几页
 * @param pageSize 每页显示多少项目
 * @returns 管理员获取用户信息的请求响应
 */
export const adminGetUserInfo = async (AdminGetUserInfoRequest: AdminGetUserInfoRequestDto): Promise<AdminGetUserInfoResponseDto> => {
	return await GET(`${USER_API_URI}/adminGetUserInfo?isOnlyShowUserInfoUpdatedAfterReview=${AdminGetUserInfoRequest.isOnlyShowUserInfoUpdatedAfterReview}&page=${AdminGetUserInfoRequest.pagination.page}&pageSize=${AdminGetUserInfoRequest.pagination.pageSize}&sortBy=${AdminGetUserInfoRequest.sortBy}&sortOrder=${AdminGetUserInfoRequest.sortOrder}&uid=${AdminGetUserInfoRequest.uid}`, { credentials: "include" }) as AdminGetUserInfoResponseDto;
};

/**
 * 管理员获取封禁用户信息
 */
export const adminGetBlockedUserInfo = async (GetBlockedUserRequest: GetBlockedUserRequestDto): Promise<GetBlockedUserResponseDto> => {
	return await GET(`${USER_API_URI}/blocked/info?uid=${GetBlockedUserRequest.uid}&page=${GetBlockedUserRequest.pagination.page}&pageSize=${GetBlockedUserRequest.pagination.pageSize}`, { credentials: "include" }) as GetBlockedUserResponseDto;
};

/**
 * 管理员删除用户信息
 * @param AdminClearUserInfoRequest 管理员删除用户信息的请求载荷
 * @returns 管理员删除用户信息的请求响应
 */
export const adminClearUserInfo = async (AdminClearUserInfoRequest: AdminClearUserInfoRequestDto): Promise<AdminClearUserInfoResponseDto> => {
	return await POST(`${USER_API_URI}/adminClearUserInfo`, AdminClearUserInfoRequest, { credentials: "include" }) as AdminClearUserInfoResponseDto;
};

/**
 * 管理员编辑用户信息
 * @param AdminEditUserInfoRequest 管理员编辑用户信息的请求载荷
 * @returns 管理员编辑用户信息的请求响应
 */
export const adminEditUserInfo = async (AdminEditUserInfoRequest: AdminEditUserInfoRequestDto): Promise<AdminEditUserInfoResponseDto> => {
	return await POST(`${USER_API_URI}/adminEditUserInfo`, AdminEditUserInfoRequest, { credentials: "include" }) as AdminEditUserInfoResponseDto;
};
