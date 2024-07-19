import { afterEach, beforeEach, expect, test } from "vitest";
import { Client } from ".";
import { createCache } from "./cache";
import { persistCache, populateCache } from "./fixtures/cache";

const client = new Client({
	cache: createCache(),
});

beforeEach(async ctx => {
	await populateCache(ctx.task.name, client.cache!);
});

afterEach(async ctx => {
	await persistCache(ctx.task.name, client.cache!);
});

test("get-bulk-package-downloads", async () => {
	await expect(
		client.getBulkPackageDownloads(["npm", "react"], "last-week"),
	).resolves.toBeDefined();
	await expect(
		client.getBulkPackageDownloads(["npm", "react"], "last-month"),
	).resolves.toBeDefined();
	await expect(
		client.getBulkPackageDownloads(["npm", "react"], "last-year"),
	).resolves.toBeDefined();

	// Non existing package.
	await expect(
		client.getBulkPackageDownloads(["npm", "radial-guts-fool-bullseye-hypnotist"], "last-week"),
	).resolves.toBeDefined();

	// Scoped package names are not supported by the npm registry.
	await expect(
		client.getBulkPackageDownloads(["npm", "@types/node"], "last-week"),
	).rejects.toThrow();
});
