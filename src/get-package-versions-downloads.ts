import { z } from "zod";
import { assertValidPackageName } from "./assert-valid-package-name";
import { fetchData } from "./fetch-data";
import { NPM_REGISTRY_DOWNLOADS_API_URL } from "./npm-registry";

export const PackageVersionsDownloads = z.object({
	// Package name.
	package: z.string(),
	// Mapping of semver version numbers to total number of downloads.
	downloads: z.record(z.number()),
});

/**
 * `PackageVersionsDownloads` describes the total number of downloads
 * for each version of a package in the previous 7 days.
 * @see {@link https://github.com/npm/registry/blob/master/docs/download-counts.md#per-version-download-counts}
 */
export type PackageVersionsDownloads = z.infer<typeof PackageVersionsDownloads>;

/**
 * `getPackageVersionsDownloads` returns the total number of downloads
 * for each version of a package in the previous 7 days.
 *
 * @param name - package name
 * @param registry - URL of the registry downloads API (default: npm registry downloads API)
 *
 * @see {@link PackageVersionsDownloads}
 */
export async function getPackageVersionsDownloads(
	name: string,
	registry = NPM_REGISTRY_DOWNLOADS_API_URL,
): Promise<PackageVersionsDownloads> {
	assertValidPackageName(name);
	const url = new URL(`/versions/${encodeURIComponent(name)}/last-week`, registry);
	return fetchData(PackageVersionsDownloads, url.toString());
}
