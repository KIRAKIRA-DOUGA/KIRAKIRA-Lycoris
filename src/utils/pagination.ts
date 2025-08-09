/**
 * 根据数据总量和每页显示数量计算总页数。
 * @param dataCount 数据总量
 * @param pageSize 每页显示数据
 * @returns 总页数结果
 */
export function getPageCountByDataCount(dataCount: number, pageSize: number): number {
	return Math.max(1, Math.ceil(dataCount / pageSize));
}
