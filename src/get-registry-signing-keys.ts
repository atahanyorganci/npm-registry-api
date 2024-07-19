import { z } from "zod";
import { fetchData } from "./fetch-data";
import { NPM_REGISTRY_API_URL } from "./npm-registry";

export const RegistrySigningKeys = z.object({
	keys: z.array(
		z.object({
			// String in the simplified extended ISO 8601 format (e.g., `YYYY-MM-DDTHH:mm:ss.sssZ`) or `null`.
			expires: z.string().nullable(),
			// SHA256 fingerprint of the public key.
			keyid: z.string(),
			// Key type; only `ecdsa-sha2-nistp256` is currently supported by the npm CLI.
			keytype: z.string(),
			// Key scheme; only `ecdsa-sha2-nistp256` is currently supported by the npm CLI.
			scheme: z.string(),
			// Public key encoded in base64.
			key: z.string(),
		}),
	),
});

/**
 * `RegistrySigningKeys` describes the signing keys used by the registry.
 * @see {@link https://docs.npmjs.com/about-registry-signatures}
 */
export type RegistrySigningKeys = z.infer<typeof RegistrySigningKeys>;

/**
 * `getRegistrySigningKeys` returns the public signing keys used by the registry.
 *
 * @param registry - URL of the registry (default: npm registry)
 *
 * @see {@link RegistrySigningKeys}
 */
export async function getRegistrySigningKeys(
	registry = NPM_REGISTRY_API_URL,
): Promise<RegistrySigningKeys> {
	const url = new URL("-/npm/v1/keys", registry);
	return fetchData(RegistrySigningKeys, url.toString());
}
