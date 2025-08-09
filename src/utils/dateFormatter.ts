export const formatDateTime = (timestamp: number) => {
	if (!timestamp) return null;

  // 自动处理秒级/毫秒级时间戳
	const ts = timestamp > 9999999999 ? timestamp : timestamp * 1000;

	return {
		formatted: Intl.DateTimeFormat("zh-CN", {
			timeZone: "Asia/Shanghai",
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		}).format(ts),
	};
};
