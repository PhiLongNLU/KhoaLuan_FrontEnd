import { createHash } from 'crypto';

export class EncryptService {

    /**
     * Hashes a given string using the SHA-256 algorithm.
     * @param str The string to hash.
     * @returns The resulting hash in hexadecimal format.
     */
    public static hashString(str: string): string {
        return createHash('sha256').update(str).digest('hex');
    }
}