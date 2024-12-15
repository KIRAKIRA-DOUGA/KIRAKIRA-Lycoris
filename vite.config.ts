import vue from "@vitejs/plugin-vue";
import autoImport from "unplugin-auto-import/vite";
import components from "unplugin-vue-components/vite";
import vueRouter from "unplugin-vue-router/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const isDevelopment = mode === "development";
	return {
		plugins: [
			tsconfigPaths(),
			vueRouter({
				dts: "./src/types/auto-router.d.ts",
			}),
			vue(),
			autoImport({
				imports: [
					"vue",
				],
				dirs: [
					"./src/components/**",
					"./src/composables",
					"./src/utils",
					"./src/contexts",
					"./src/stores",
					"./src/classes",
					"./src/api/**",
				],
				dts: "./src/types/auto-imports.d.ts",
				defaultExportByFilename: false,
			}),
			components({
				dts: "./src/types/auto-components.d.ts",
			}),
		],
		css: {
			postcss: {
				plugins: [
					tailwindcss,
					autoprefixer,
				],
			},
			modules: {
				localsConvention: "camelCaseOnly",
			},
		},
		build: {
			target: "ESNext",
			assetsInlineLimit: 200,
			chunkSizeWarningLimit: 500_000, // 500MB
			minify: "terser", // When enabled, smaller but slower.
			terserOptions: {
				keep_classnames: true,
			},
		},
		esbuild: {
			keepNames: true, // When enabled, not only keep the class names, but also unexpectedly keep the function names.
			jsxFactory: "h",
			jsxFragment: "Fragment",
		},
		assetsInclude: [
			"**/*.cur",
			"**/*.ani",
		],
		server: {
			https: isDevelopment ? {
				cert: fs.readFileSync("./ssl/cert.pem"),
				key: fs.readFileSync("./ssl/key.pem"),
			} : undefined,
		},
	};
});
