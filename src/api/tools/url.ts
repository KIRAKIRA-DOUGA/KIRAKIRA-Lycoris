/**
 * 生成 URL 后面的查询参数
 * @param obj 查询参数
 * @returns URL 后面的查询参数
 */
export function getUrlQuery(obj: Record<string, unknown>): string {
	// 构建查询参数
	const params = new URLSearchParams();

	Object.entries(obj).forEach(([key, value]) => {
		if (value !== undefined && value !== null)
			params.append(key, String(value));
	});

	return `?${params.toString()}`;
}
