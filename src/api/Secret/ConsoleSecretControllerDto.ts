/**
 * 获取预生产环境后端环境变量机密的请求响应
 */
export type GetStgEnvBackEndSecretResponse = {
	/** 是否请求成功 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 预生产环境后端环境变量机密 */
	result: {
		envs?: Record<string, string>;
	};
};
