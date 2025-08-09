export const useSelfUserInfoStore = defineStore("user-info", {
	state: () => ({
		/**
		 * 是否执行了至少一次有效的用户校验？
		 *
		 * “至少一次有效的用户校验”的定义如下：
		 * 1. 在 SSR 或 CSR 时成功获取了用户信息 `${USER_API_URI}/self`。
		 * 2. 在 CSR 时校验用户 token 未通过。（尽管校验未通过，但这仍然是一次有效的校验）`${USER_API_URI}/check`
		 *
		 * // NOTE: “有效的校验”并不指用户校验通过，而是程序使用客户端提供（或者未提供）的、值得信赖的 Cookie 执行了至少一次用户校验。
		 * // NOTE: 在某些需要严格校验或同时涉及到 SSR 与 CSR 的情况下，只有 isEffectiveCheckOnce 为 true 时，isLogined 以及其他 useSelfUserInfoStore 的属性才是有效、准确、可信的。
		 */
		isEffectiveCheckOnce: false,
		/** 是否已经登录？ */
		isLogined: false,
		/** 当前登录的用户的 UID */
		uid: undefined as undefined | number,
		/** 用户的邮箱 */
		userEmail: undefined as undefined | string,
		/** 当前用户的注册时间 */
		userCreateDateTime: 0,
		/** 当前用户的身份 */
		roles: ["user"],
		/** 当前登录的用户用户名。 */
		username: "",
		/** 当前登录的用户昵称 */
		userNickname: "",
		/** 当前登录的用户的头像 */
		userAvatar: "",
		/** 当前登录的用户的性别 */
		gender: "",
		/** 当前登录的用户的个性签名或简介 */
		signature: "",
		/** 当前登录的用户的生日 */
		birthday: 0,
		/** 当前登录的用户的标签 */
		tags: [] as string[],
		/** 暂时从侧栏中隐藏头像？ */
		tempHideAvatarFromSidebar: false,
	}),
});
