import { PackageLinks } from './package-links';
import { Person } from './person';

/**
 * PackageSearchResult contains abbreviated package metadata returned
 * by the searching the registry for packages.
 */
export interface PackageSearchResult {
    /** Package name */
    readonly name: string;

    /** Package scope; either `unscoped` or the package's scope */
    readonly scope: string;

    /** Latest package version number */
    readonly version: string;

    /** Package's description */
    readonly description?: string;

    /** Keywords describing the package */
    readonly keywords?: string[];

    /** Publishing timestamp for the latest version */
    readonly date: string;

    /**
     * Useful links
     * @see {@link PackageLinks}
     */
    readonly links: PackageLinks;

    /**
     * Package publisher
     * @see {@link Person}
     */
    readonly publisher: Person;

    /**
     * Package author
     * @see {@link Person}
     */
    readonly author?: Person;

    /**
     * Package maintainers
     * @see {@link Person}
     */
    readonly maintainers?: Person[];
}