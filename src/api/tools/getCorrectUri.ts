/**
 * 根据当前环境返回正确的后端地址
 * @returns 正确的后端地址。
 */
export default function getCorrectUri(): string {
	/**
	 * 读取环境变量中 VITE_BACKEND_URI 的值，作为后端 API 的 URI
	 * 如果 VITE_BACKEND_URI 的值为 none，则返回空字符串，KIRAKRIA-Lycoris 将会以无后端模式启动
	 */
	try {
		const backendUriInput = import.meta.env.VITE_BACKEND_URI;

		if (!backendUriInput) {
			console.error("ERROR", "Server startup failed, the value of the environment variable VITE_BACKEND_URI was not specified.");
			return "";
		}

		if (backendUriInput === "none")
			return "";

		const backendUri = new URL(backendUriInput.trim());
		const backendUriHref = backendUri.href;
		if (!backendUriHref) {
			console.error("ERROR", "System startup failed, the parsed result of the environment variable VITE_BACKEND_URI is empty.");
			return "";
		}

		return backendUriHref;
	} catch (error) {
		console.error("ERROR", "System startup failed, environment variable VITE_BACKEND_URI parsing failed: ", error);
		return "";
	}
}

export const backendUri = getCorrectUri(); // 后端 API URI
export const noBackend = !backendUri; // 是否为无后端模式
