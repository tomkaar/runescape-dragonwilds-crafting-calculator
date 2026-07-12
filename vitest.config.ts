import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		setupFiles: ["./test/setup.ts"],
		coverage: {
			provider: "v8",
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "."),
		},
	},
});
