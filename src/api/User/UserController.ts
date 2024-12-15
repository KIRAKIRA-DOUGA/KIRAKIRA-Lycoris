import { GET, POST } from "api/tools/fetch";
import getCorrectUri from "api/tools/getCorrectUri";
import { GetSelfUserInfoRequestDto, GetSelfUserInfoResponseDto, CheckUserTokenResponseDto, UserLogoutResponseDto, UserLoginRequestDto, UserLoginResponseDto } from "./UserControllerDto";

const BACK_END_URL = getCorrectUri();
const USER_API_URL = `${BACK_END_URL}/user`;

/**
 * 用户登录
 * @param userLoginRequest 用户登录提交的参数
 * @returns 用户登录的返回参数
 */
export const userLogin = async (userLoginRequest: UserLoginRequestDto): Promise<UserLoginResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await POST(`${USER_API_URL}/login`, userLoginRequest, { credentials: "include" }) as UserLoginResponseDto;
};

/**
 * 获取当前登录的用户信息，前提是 token 中包含正确的 uid 和 token，同时丰富全局变量中的用户信息
 * @param getSelfUserInfoRequest 获取当前登录的用户信息的请求参数
 * @param pinia pinia
 * @returns 用户信息
 */
export const getSelfUserInfo = async (getSelfUserInfoRequest?: GetSelfUserInfoRequestDto): Promise<GetSelfUserInfoResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	const selfUserInfo = await POST(`${USER_API_URL}/self`, getSelfUserInfoRequest, { credentials: "include" }) as GetSelfUserInfoResponseDto;
	const selfUserInfoResult = selfUserInfo.result;
	if (selfUserInfo.success && selfUserInfoResult) {
		const selfUserInfoStore = useSelfUserInfoStore();
		selfUserInfoStore.isLogined = true;
		selfUserInfoStore.uid = selfUserInfoResult.uid;
		selfUserInfoStore.userCreateDateTime = selfUserInfoResult.userCreateDateTime ?? 0;
		selfUserInfoStore.role = selfUserInfoResult.role ?? "user";
		selfUserInfoStore.userEmail = selfUserInfoResult.email ?? "";
		selfUserInfoStore.userAvatar = selfUserInfoResult.avatar || "";
		selfUserInfoStore.username = selfUserInfoResult.username || "Anonymous"; // TODO: 使用多语言，为未设置用户名的用户提供国际化的缺省用户名
		selfUserInfoStore.userNickname = selfUserInfoResult.userNickname || ""; // TODO: 使用多语言，为未设置用户昵称的用户提供国际化的缺省用户昵称
		selfUserInfoStore.gender = selfUserInfoResult.gender || "";
		selfUserInfoStore.signature = selfUserInfoResult.signature || "";
		selfUserInfoStore.tags = selfUserInfoResult.label?.map(label => label.labelName) || [];
	} else
		await userLogout();
	return selfUserInfo;
};

/**
 * 校验用户 token 是否合法，同时可以验证用户是否已经登录
 * @returns 用户信息
 */
export const checkUserToken = async (): Promise<CheckUserTokenResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await GET(`${USER_API_URL}/check`, { credentials: "include" }) as CheckUserTokenResponseDto;
};

/**
 * 用户登出
 * @returns 什么也不返回，但是会携带立即清除的 cookie 并覆盖原本的 cookie，同时将全局变量中的用户信息置空
 */
export async function userLogout(): Promise<UserLogoutResponseDto> {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	const logoutResult = await GET(`${USER_API_URL}/logout`, { credentials: "include" }) as UserLogoutResponseDto;
	if (logoutResult.success) {
		const selfUserInfoStore = useSelfUserInfoStore();
		selfUserInfoStore.isLogined = false;
		selfUserInfoStore.uid = undefined;
		selfUserInfoStore.userCreateDateTime = 0;
		selfUserInfoStore.role = "user";
		selfUserInfoStore.userEmail = "";
		selfUserInfoStore.userAvatar = "";
		selfUserInfoStore.username = "";
		selfUserInfoStore.userNickname = "";
		selfUserInfoStore.gender = "";
		selfUserInfoStore.signature = "";
		selfUserInfoStore.tags = [];
	} else
		console.error("ERROR", "用户登出失败"); // TODO: 使用多语言
	return logoutResult;
}
