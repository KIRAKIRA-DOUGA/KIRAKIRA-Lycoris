import { GetStgEnvBackEndSecretResponse } from "./ConsoleSecretControllerDto";

const SECRET_API_URI = `${backendUri}secret`;

/**
 * 获取预生产环境后端环境变量机密
 * @returns 获取预生产环境后端环境变量机密的请求响应
 */
export const getStgEnvBackEndSecretController = async (): Promise<GetStgEnvBackEndSecretResponse> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await GET(`${SECRET_API_URI}/getStgEnvBackEndSecret`, { credentials: "include" }) as GetStgEnvBackEndSecretResponse;
};
