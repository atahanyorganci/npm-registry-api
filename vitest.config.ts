import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		coverage: { include: ["src/**"] },
		exclude: [...configDefaults.exclude, "old"],
		setupFiles: ["./vitest.setup.ts"],
	},
});
