import vue from "@vitejs/plugin-vue";
import autoImport from "unplugin-auto-import/vite";
import components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import vueRouter from "unplugin-vue-router/vite";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import autoprefixer from "autoprefixer";
import fs from "fs";
import htmlMinifier from "vite-plugin-html-minifier";
import naiveUIJson from "naive-ui/web-types.json" with { type: "json" };
const naiveUIComponents = naiveUIJson.contributions.html["vue-components"].map(component => component.name);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const isDevelopment = mode === "development";
	const env = loadEnv(mode, process.cwd(), "");
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
					{
						vue: ["useTemplateRef"],
						"naive-ui": [
							"useDialog",
							"useMessage",
							"useNotification",
							"useLoadingBar",
							...naiveUIComponents,
						],
						pinia: ["defineStore"],
						"vue-router": ["RouterLink"],
						"vue/jsx-runtime": ["Fragment"],
					},
					{
						from: "naive-ui",
						imports: [
							"DataTableColumns",
							"FormItemRule",
							"MenuOption",
						],
						type: true,
					},
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
				dirs: [
					"./src/components/**",
				],
				extensions: ["vue", "tsx", "jsx"],
				resolvers: [NaiveUiResolver()],
			}),
			tailwindcss(),
			htmlMinifier({
				minify: {
					collapseWhitespace: true,
					keepClosingSlash: false,
					removeComments: true,
					removeRedundantAttributes: true,
					removeScriptTypeAttributes: true,
					removeStyleLinkTypeAttributes: true,
					removeEmptyAttributes: true,
					useShortDoctype: true,
					minifyCSS: true,
					minifyJS: true,
					minifyURLs: true,
				},
			}),
		],
		css: {
			postcss: {
				plugins: [
					autoprefixer as never,
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
			rollupOptions: {
				output: {
					entryFileNames: "[name].js",
					chunkFileNames: "chunks/[name].js",
					assetFileNames: "assets/[name].[hash].[ext]",
				},
			},
		},
		esbuild: {
			keepNames: true, // When enabled, not only keep the class names, but also unexpectedly keep the function names.
			jsxFactory: "h",
			jsxFragment: "Fragment",
		},
		server: {
			https: isDevelopment ? {
				cert: fs.readFileSync("./ssl/cert.pem"),
				key: fs.readFileSync("./ssl/key.pem"),
			} : undefined,
		},
	};
});
