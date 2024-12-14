/**
 * 根据当前环境（开发或生产）返回正确的后端地址
 * @returns 正确的后端地址。
 */
export default function getCorrectUri() {
	/**
	 * URI 必须包含协议头，不建议在结尾添加斜线 '/'
	 * eg. https://localhost:9999
	 *
	 * 请特别注意下方多个 if 判断中，变量 backendUrl 的值被改变的顺序。
	 * 例如，当 staging 或 production 为真时，即使 localBackend 为真，也不会使用本地后端。
	 */

	const LOCAL_BACKEND_URI = "https://localhost:9999";
	const PROD_BACKEND_URI = "https://rosales.kirakira.moe";

	const BACK_END_PROVIDER = import.meta.env.VITE_BACK_END_PROVIDER;
	const backendUrl = BACK_END_PROVIDER === "local" ? LOCAL_BACKEND_URI : PROD_BACKEND_URI; // 如果环境变量 BACK_END_PROVIDER 的值为 local，则使用本地 API。

	return backendUrl;
}
