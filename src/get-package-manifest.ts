import urlJoin from "url-join";
import { z } from "zod";
import { PackageJson } from "zod-package-json";
import { assertValidPackageName } from "./assert-valid-package-name";
import { fetchData } from "./fetch-data";
import { npmRegistryUrl } from "./npm-registry";

/**
`Dist` describes the distribution metadata generated by the registry.
@see {@link https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md#dist}
*/
const Dist = z.object({
	/** Tarball URL. */
	tarball: z.string(),

	/** SHA1 sum of the tarball. */
	shasum: z.string(),

	/** String in the format `<hashAlgorithm>-<base64-hash>`. */
	integrity: z.string().optional(),

	/** Number of files in the tarball. */
	fileCount: z.number().optional(),

	/** Total unpacked size in bytes of the files in the tarball. */
	unpackedSize: z.number().optional(),

	/**
  PGP signature in the format `<package>@<version>:<integrity>`.
	@deprecated {@link https://docs.npmjs.com/about-registry-signatures#migrating-from-pgp-to-ecdsa-signatures}
	*/
	"npm-signature": z.string().optional(),

	/**
	ECDSA registry signatures.
	@see {@link https://docs.npmjs.com/about-registry-signatures}
  */
	signatures: z
		.array(
			z.object({
				keyid: z.string(),
				sig: z.string(),
			}),
		)
		.optional(),
});

export const PackageManifest = PackageJson.extend({
	/** Package version ID in the format `<name>@<version>` (e.g., `foo@1.0.0`). */
	_id: z.string(),

	/** Distribution metadata generated by the registry. */
	dist: Dist,

	/** Text extracted from the README file. */
	readme: z.string().optional(),

	/** Name of the README file. */
	readmeFilename: z.string().optional(),

	/** Commit corresponding to the published package version. */
	gitHead: z.string().optional(),

	/** True if the package contains a shrinkwrap file. */
	_hasShrinkwrap: z.boolean().optional(),

	/** Node.js version used to publish the package. */
	_nodeVersion: z.string().optional(),

	/** npm CLI version used to publish the package. */
	_npmVersion: z.string().optional(),

	/** npm user who published the specific version of the package. */
	_npmUser: PackageJson.shape.author.optional(),

	/** Internal npm registry data. */
	_npmOperationalInternal: z
		.object({
			host: z.string().optional(),
			tmp: z.string().optional(),
		})
		.optional(),

	/**
	Runtime systems supported by the package.

	@remarks
	In some old packages (like `lodash@0.1.0`) the `engines` property is an array of strings
	instead of an object and with catch it becomes `undefined`.
	*/
	engines: z.record(z.string()).optional().catch(undefined),

	/**
	SPDX license expression or a custom license.

	@remarks
	In some old packages (like `eslint@0.0.6`) the `license` property is an object
	and with catch `license` becomes `undefined`.
	*/
	license: z.string().optional().catch(undefined),

	/**
	URL of the package's homepage.

	@remarks
	In some old packages (like `fs-extra@0.0.1`) the `homepage` property is an array
	of strings and with catch it becomes `undefined`.
	*/
	homepage: z.string().optional().catch(undefined),

	/**
	Deprecation status/message.

	@remarks
	In some packages (like `react@16.14.0`) the `deprecated` property is a boolean
	instead of a deprecation message.
	*/
	deprecated: z.union([z.string(), z.boolean()]).optional(),
});

/**
`PackageManifest` describes the manifest for a specific version of a package (e.g., `foo@1.0.0`).

@remarks
The manifest contains data extracted from `package.json` as well as data generated by the registry.

@see {@link https://docs.npmjs.com/cli/v10/configuring-npm/package-json}
@see {@link https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md#getpackageversion}
@see {@link https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md#abbreviated-version-object}
@see {@link https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md#full-metadata-format}
@see {@link https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md#version}
*/
export type PackageManifest = z.infer<typeof PackageManifest>;

/**
`getPackageManifest` returns the manifest describing a specific version of a package (e.g., `foo@1.0.0`).

@param name - package name
@param versionOrTag - semver version number (e.g., `1.0.0`) or distribution tag (e.g., `latest`) (default: `latest`)
@param registry - URL of the registry (default: npm registry)

@see {@link PackageManifest}
*/
export const getPackageManifest = async (
	name: string,
	versionOrTag = "latest",
	registry = npmRegistryUrl,
): Promise<PackageManifest> => {
	assertValidPackageName(name);
	return fetchData(PackageManifest, urlJoin(registry, name, versionOrTag));
};
