import type { JSX as _JSX } from "vue/jsx-runtime";
export { };

// FIXME: 此处断言了 unplugin-vue-components/vite 包中导出的 components 的类型，用于防止 vite.config.js 中的报错，但这并非最佳实践。
declare module "unplugin-vue-components/vite" {
	import { Plugin } from "vite";
	const components: ({ dts: string }) => any;
	export default components;
}

declare global {
	namespace JSX {
		export type Element = _JSX.Element;
		export type ElementClass = _JSX.ElementClass;
		export type ElementAttributesProperty = _JSX.ElementAttributesProperty;
		export type IntrinsicElements = _JSX.IntrinsicElements;
		export type IntrinsicAttributes = _JSX.IntrinsicAttributes;
	}
}
