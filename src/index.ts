/**
 * # npm Registry API Client
 *
 * `@yorganci/npm-registry-api` is a fully typesafe [npm registry API][npm-registry-api] client with optional caching.
 *
 * ## Features
 *
 * - Validates registry responses using [`zod`](https://github.com/colinhacks/zod).
 * - Supports response caching with [`unstorage`](https://github.com/unjs/unstorage).
 * - Compatible with both Node.js and browser environments.
 * - Works seamlessly with third-party npm-compatible registries.
 *
 * ## Useful Links
 *
 * - [npm registry API][npm-registry-api] for REST API docs.
 * - [`ohash` docs](https://github.com/unjs/ohash) for serializing cache keys.
 * - [`unstorage` drivers](https://unstorage.unjs.io/drivers) for caching layer.
 *
 * ## npm Registry API
 *
 * @example
 * Get the metadata about the npm registry itself, if available:
 *
 * ```typescript
 * import { Client } from "@yorganci/npm-registry-api";
 *
 * const client = new Client();
 * const metadata = await getRegistryMetadata();
 * ```
 *
 * @example
 * Get the public signing keys for the npm registry:
 *
 * ```typescript
 * import { Client } from "@yorganci/npm-registry-api";
 *
 * const client = new Client();
 * const { keys } = await client.getRegistrySigningKeys();
 * ```
 *
 * @example
 * Get the abbreviated packument containing only the necessary data to install the `react` package:
 *
 * ```typescript
 * import { Client } from "@yorganci/npm-registry-api";
 *
 * const client = new Client();
 * const abbrPackument = await client.getAbbreviatedPackument("react");
 * ```
 *
 * @example
 * Get the full packument containing all the data available about the `react` package:
 *
 * ```typescript
 * import { Client } from "@yorganci/npm-registry-api";
 *
 * const client = new Client();
 * const packument = await client.getPackument("react");
 * ```
 *
 * @example
 * Get the manifest containing the original `package.json` data plus additional registry metadata for the `latest` version of the `react` package:
 *
 * ```typescript
 *
 * import { Client } from "@yorganci/npm-registry-api";
 *
 * const client = new Client();
 * const manifest = await client.getPackageManifest("react");
 * ```
 *
 * @example
 * Get the manifest for `react@18.2.0` (semver version):
 *
 * ```typescript
 * import { Client } from "@yorganci/npm-registry-api";
 *
 * const client = new Client();
 * const manifest = await client.getPackageManifest("react", "18.2.0");
 * ```
 *
 * @example
 * Get the manifest for `react@next` (distribution tag):
 *
 * ```typescript
 * import { Client } from "@yorganci/npm-registry-api";
 *
 * const client = new Client();
 * const manifest = await client.getPackageManifest("react", "next");
 * ```
 *
 * @example
 * Search packages related to `react` (e.g., `react`, `react-dom`, ...):
 *
 * ```typescript
 * import { Client } from "@yorganci/npm-registry-api";
 *
 * const client = new Client();
 * const results = await client.searchPackages({ text: "react" });
 * ```
 *
 * @example
 * Get the total number of downloads for package `react` for the last month:
 *
 * ```typescript
 * import { Client } from "@yorganci/npm-registry-api";
 *
 * const client = new Client();
 * const { downloads } = await client.getPackageDownloads("react", "last-month");
 * ```
 *
 * There are also these other download counts functions available: `getBulkDailyPackageDownloads`, `getBulkPackageDownloads`, `getDailyPackageDownloads`, `getDailyRegistryDownloads` and `getPackageVersionsDownloads`.
 *
 * ## Caching API
 *
 * `@yorganci/npm-registry-api/cache` module provides basic factory function to create `Cache` object to be used by `Client`.
 * By default `createCache`, uses `ohash` under the hood to generate cache keys from URL and HTTP headers and any `Driver`
 * implementation from `unstorage` can be used for persistance the default is `unstorage/drivers/memory`.
 *
 * @example
 * Basic usage with default driver.
 *
 * ```ts
 * import { Client } from "@yorganci/npm-registry-api";
 * import { createCache } from "@yorganci/npm-registry-api/cache";
 *
 * // By default `Map<string, unknown>` is used as caching layer
 * const cachedClient = new Client({
 *   cache: createCache(),
 * });
 * ```
 *
 * @example
 * Usage with `fsDriver` from `unstorage`.
 *
 * ```ts
 * import { Client } from "@yorganci/npm-registry-api";
 * import { createCache } from "@yorganci/npm-registry-api/cache";
 * import fs from "unstorage/drivers/fs";
 *
 * const cachedClient = new Client({
 *   cache: createCache({
 *     storage: fs({
 *       base: "./data",
 *     }),
 *   }),
 * });
 *
 * @see {@link https://unstorage.unjs.io/drivers | `unstorage`} drivers for the cache API.
 * @module
 */
export { PackageJson } from "zod-package-json";
export {
	LegacyPackageName,
	PackageName,
	assertStrictPackageName,
	assertValidPackageName,
} from "./assert-valid-package-name";
export { DownloadPeriod } from "./download-period";
export { AbbreviatedPackument } from "./get-abbreviated-packument";
export { BulkDailyPackageDownloads } from "./get-bulk-daily-package-downloads";
export { BulkPackageDownloads } from "./get-bulk-package-downloads";
export { DailyPackageDownloads } from "./get-daily-package-downloads";
export { DailyRegistryDownloads } from "./get-daily-registry-downloads";
export { PackageDownloads } from "./get-package-downloads";
export { PackageManifest } from "./get-package-manifest";
export { PackageVersionsDownloads } from "./get-package-versions-downloads";
export { Packument } from "./get-packument";
export { RegistryDownloads } from "./get-registry-downloads";
export { RegistryMetadata } from "./get-registry-metadata";
export { RegistrySigningKeys } from "./get-registry-signing-keys";
export { NPM_REGISTRY_API_URL, NPM_REGISTRY_DOWNLOADS_API_URL } from "./npm-registry";
export { SearchCriteria, SearchResults } from "./search-packages";

import { ofetch } from "ofetch";
import type { Storage } from "unstorage";
import type { z } from "zod";
import { assertValidPackageName } from "./assert-valid-package-name";
import type { DownloadPeriod } from "./download-period";
import { AbbreviatedPackument } from "./get-abbreviated-packument";
import { BulkDailyPackageDownloads } from "./get-bulk-daily-package-downloads";
import { BulkPackageDownloads } from "./get-bulk-package-downloads";
import { DailyPackageDownloads } from "./get-daily-package-downloads";
import { DailyRegistryDownloads } from "./get-daily-registry-downloads";
import { PackageDownloads } from "./get-package-downloads";
import { PackageManifest } from "./get-package-manifest";
import { PackageVersionsDownloads } from "./get-package-versions-downloads";
import { Packument } from "./get-packument";
import { RegistryDownloads } from "./get-registry-downloads";
import { RegistryMetadata } from "./get-registry-metadata";
import { RegistrySigningKeys } from "./get-registry-signing-keys";
import { NPM_REGISTRY_API_URL, NPM_REGISTRY_DOWNLOADS_API_URL } from "./npm-registry";
import { type SearchCriteria, SearchResults } from "./search-packages";

/**
 * {@link Client | `Client`} uses `Cache` instance as a read-through cache first URL and
 * HTTP headers are checked in `Cache.storage`, if the resource is in the cache no request
 * is sent. Otherwise, resource is fetched and persisted on the cache.
 * @public
 */
export interface Cache {
	// Function to use when serializing request URL and headers.
	serialize: (object: unknown) => string;
	/**
	 * {@link Storage | `Storage`} instance from {@link https://unstorage.unjs.io/guide | `unstorage`} used for
	 * persisting resources.
	 */
	storage: Storage;
}

/**
 * {@link Client | `Client`} options to configure caching and registry endpoints.
 * @public
 */
export interface ClientOptions {
	cache: Cache;
	registryApiUrl: string;
	downloadsApiUrl: string;
}

/**
 * [npm Registry API](https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md) client with
 * options to configure caching and registry endpoints.
 * @public
 */
export class Client {
	public readonly cache?: Cache;
	public readonly registryApiUrl: string;
	public readonly downloadsApiUrl: string;

	/**
	 * Client options to configure caching and registry API endpoints.
	 *
	 * @param options - {@link ClientOptions}
	 */
	constructor({ cache, registryApiUrl, downloadsApiUrl }: Partial<ClientOptions> = {}) {
		this.cache = cache;
		this.registryApiUrl = registryApiUrl ?? NPM_REGISTRY_API_URL;
		this.downloadsApiUrl = downloadsApiUrl ?? NPM_REGISTRY_DOWNLOADS_API_URL;
	}

	/**
	 * Performs fetch with `ofetch` to be compatible with both server and browser runtimes.
	 * If caching is enabled then, first cache is checked for response before any HTTP request
	 * is made. Responses are automatically cached.
	 *
	 * @param schema - {@link https://www.npmjs.com/package/zod | `zod`} to validate response with
	 * @param url - fully qualified URL to fetch resources form
	 * @param headers - HTTP headers for the request
	 */
	async fetch<T extends z.Schema>(
		schema: T,
		url: string,
		headers?: Record<string, string>,
	): Promise<z.infer<T>> {
		if (!this.cache) {
			const response = await ofetch(url, { headers });
			return schema.parse(response);
		}
		const key = this.cache.serialize({ url, headers });
		const value = await this.cache.storage.getItem(key);
		if (value) {
			return schema.parse(value);
		}
		const response = await ofetch(url, { headers });
		const data = schema.parse(response);
		await this.cache.storage.setItem(key, data);
		return data;
	}

	/**
	 * `getAbbreviatedPackument` returns the abbreviated packument (package document)
	 * containing only the metadata necessary to install a package.
	 *
	 * @remarks
	 * To get all the metadata (full packument) about a package see {@link Client.getPackument}.
	 *
	 * @param name - package name
	 *
	 * @see {@link AbbreviatedPackument}
	 */
	async getAbbreviatedPackument(name: string): Promise<AbbreviatedPackument> {
		assertValidPackageName(name);
		const url = new URL(name, this.registryApiUrl);
		return this.fetch(AbbreviatedPackument, url.toString(), {
			Accept: "application/vnd.npm.install-v1+json",
		});
	}

	/**
	 * `getBulkDailyPackageDownloads` returns the total number of downloads for each day
	 * for some packages in the given time period.
	 *
	 * @param names - list of package names; the npm registry does not support scoped packages and handles a maximum of 128 packages at a time
	 * @param period - {@link DownloadPeriod | time period} in which downloads happened; the npm registry limits bulk data to the last 365 days
	 *
	 * @see {@link BulkDailyPackageDownloads}
	 */
	async getBulkDailyPackageDownloads(
		names: [string, string, ...string[]],
		period: DownloadPeriod,
	): Promise<BulkDailyPackageDownloads> {
		for (const name of names) {
			assertValidPackageName(name);
		}
		const url = new URL(`/downloads/range/${period}/${names.join(",")}`, this.downloadsApiUrl);
		return this.fetch(BulkDailyPackageDownloads, url.toString());
	}

	/**
	 * `getBulkPackageDownloads` returns the total number of downloads for the given packages in the given time period.
	 *
	 * @param names - list of package names; the npm registry does not support scoped packages and handles a maximum of 128 packages at a time
	 * @param period - {@link DownloadPeriod | time period} in which downloads happened; the npm registry limits bulk data to the last 365 days
	 *
	 * @see {@link BulkPackageDownloads}
	 */
	async getBulkPackageDownloads(
		names: [string, string, ...string[]],
		period: DownloadPeriod,
	): Promise<BulkPackageDownloads> {
		for (const name of names) {
			assertValidPackageName(name);
		}
		const url = new URL(`/downloads/point/${period}/${names.join(",")}`, this.downloadsApiUrl);
		return this.fetch(BulkPackageDownloads, url.toString());
	}

	/**
	 * `getDailyPackageDownloads` returns the total number of downloads for each day
	 * for a package in the given time period.
	 *
	 * @param name - package name
	 * @param period - {@link DownloadPeriod | time period} in which downloads happened; the npm registry limits data to the last 18 months
	 *
	 * @see {@link DailyPackageDownloads}
	 */
	async getDailyPackageDownloads(
		name: string,
		period: DownloadPeriod,
	): Promise<DailyPackageDownloads> {
		assertValidPackageName(name);
		const url = new URL(`/downloads/range/${period}/${name}`, this.downloadsApiUrl);
		return this.fetch(DailyPackageDownloads, url.toString());
	}

	/**
	 * `getDailyRegistryDownloads` returns the total number of downloads for each day
	 * for all packages in the registry in the given time period.
	 *
	 * @param period - {@link DownloadPeriod | time period} in which downloads happened; the npm registry limits data to the last 18 months
	 *
	 * @see {@link DailyRegistryDownloads}
	 */
	async getDailyRegistryDownloads(period: DownloadPeriod): Promise<DailyRegistryDownloads> {
		const url = new URL(`/downloads/range/${period}`, this.downloadsApiUrl);
		return await this.fetch(DailyRegistryDownloads, url.toString());
	}

	/**
	 * `getPackageDownloads` returns the total number of downloads for a package in the given time period.
	 *
	 * @param name - package name
	 * @param period - {@link DownloadPeriod | time period} in which downloads happened; the npm registry limits data to the last 18 months
	 *
	 * @see {@link PackageDownloads}
	 */
	async getPackageDownloads(name: string, period: DownloadPeriod): Promise<PackageDownloads> {
		assertValidPackageName(name);
		const url = new URL(`/downloads/point/${period}/${name}`, this.downloadsApiUrl);
		return this.fetch(PackageDownloads, url.toString());
	}

	/**
	 * `getPackageManifest` returns the manifest describing a specific version of a package (e.g., `foo@1.0.0`).
	 *
	 * @param name - package name
	 * @param versionOrTag - semver version number (e.g., `1.0.0`) or distribution tag (e.g., `latest`) (default: `latest`)
	 *
	 * @see {@link PackageManifest}
	 */
	async getPackageManifest(name: string, versionOrTag = "latest"): Promise<PackageManifest> {
		assertValidPackageName(name);
		const url = new URL(`${name}/${versionOrTag}`, this.registryApiUrl);
		return this.fetch(PackageManifest, url.toString());
	}

	/**
	 * `getPackageVersionsDownloads` returns the total number of downloads
	 * for each version of a package in the previous 7 days.
	 *
	 * @param name - package name
	 *
	 * @see {@link PackageVersionsDownloads}
	 */
	async getPackageVersionsDownloads(name: string): Promise<PackageVersionsDownloads> {
		assertValidPackageName(name);
		const url = new URL(`/versions/${encodeURIComponent(name)}/last-week`, this.downloadsApiUrl);
		return this.fetch(PackageVersionsDownloads, url.toString());
	}

	/**
	 * `getPackument` returns the full packument (package document)
	 * containing all the metadata available about a package.
	 *
	 * @remarks
	 * To get only the metadata needed to install a package (abbreviated packument)
	 * see {@link Client.getAbbreviatedPackument}.
	 *
	 * @param name - package name
	 *
	 * @see {@link Packument}
	 */
	async getPackument(name: string): Promise<Packument> {
		assertValidPackageName(name);
		return this.fetch(Packument, new URL(name, this.registryApiUrl).toString());
	}

	/**
	 * `getRegistryDownloads` returns the total number of downloads
	 * for all packages in the registry in the given time period.
	 *
	 * @param period - {@link DownloadPeriod | time period} in which downloads happened; the npm registry limits data to the last 18 months
	 *
	 * @see {@link RegistryDownloads}
	 */
	async getRegistryDownloads(period: DownloadPeriod): Promise<RegistryDownloads> {
		const url = new URL(`/downloads/point/${period}`, this.downloadsApiUrl);
		return this.fetch(RegistryDownloads, url.toString());
	}

	/**
	 * `getRegistryMetadata` returns the metadata describing the registry itself.
	 *
	 * @see {@link RegistryMetadata}
	 */
	async getRegistryMetadata(): Promise<RegistryMetadata> {
		return await this.fetch(RegistryMetadata, this.registryApiUrl);
	}

	/**
	 * `getRegistrySigningKeys` returns the public signing keys used by the registry.
	 *
	 * @see {@link RegistrySigningKeys}
	 */
	async getRegistrySigningKeys(): Promise<RegistrySigningKeys> {
		const url = new URL("-/npm/v1/keys", this.registryApiUrl);
		return this.fetch(RegistrySigningKeys, url.toString());
	}

	/**
	 * `searchPackages` returns the packages corresponding to a given query.
	 *
	 * @param criteria - one or more search criteria
	 *
	 * @see {@link SearchCriteria}
	 * @see {@link SearchResults}
	 */
	async searchPackages(criteria: SearchCriteria): Promise<SearchResults> {
		const url = new URL("-/v1/search", this.registryApiUrl);
		for (const [key, value] of Object.entries(criteria)) {
			url.searchParams.set(key, value.toString());
		}
		return await this.fetch(SearchResults, url.toString());
	}
}
