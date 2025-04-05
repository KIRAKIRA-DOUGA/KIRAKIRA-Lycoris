export const useSelfUserInfoStore = defineStore("user-info", {
	state: () => ({
		/** 是否已经登录？ */
		isLogined: false,
		/** 用户信息 */
		userInfo: { } as Exclude<GetSelfUserInfoByUuidResponseDto["result"], undefined>,
		/** 暂时从侧栏中隐藏头像？ */
		tempHideAvatarFromSidebar: false,
	}),
});
