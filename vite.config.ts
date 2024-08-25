import vue from "@vitejs/plugin-vue";
import autoImport from "unplugin-auto-import/vite";
import components from "unplugin-vue-components/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
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
			],
			dts: "./src/types/auto-imports.d.ts",
			defaultExportByFilename: false,
		}),
		components(),
		tsconfigPaths(),
	],
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
	},
	assetsInclude: [
		"**/*.cur",
		"**/*.ani",
	],
});
