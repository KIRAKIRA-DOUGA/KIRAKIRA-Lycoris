/**
 * 根据 cookie 检查一个用户是否是管理员。
 * @returns 是否为管理员？
 */
export async function checkAdminUser() {
	const userInfo = await getSelfUserInfo();
	if (userInfo.success && userInfo.result?.role === "admin")
		return true;
	else
		return false;
}
