import { GET, POST } from "api/tools/fetch";
import { GetSelfUserInfoRequestDto, GetSelfUserInfoResponseDto, CheckUserTokenResponseDto, UserLogoutResponseDto, UserLoginRequestDto, UserLoginResponseDto } from "./UserControllerDto";

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
			selfUserInfoStore.userInfo = selfUserInfoResult ?? { };
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
			selfUserInfoStore.userInfo = {};
		}
	} else
		console.error("ERROR", "用户登出失败"); // TODO: 使用多语言
	return logoutResult;
}
