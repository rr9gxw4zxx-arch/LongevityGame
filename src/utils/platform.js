/**
 * Shared platform detection utilities.
 */

const MOBILE_RE = /iPhone|iPad|iPod|Android/i;

export function isMobileDevice() {
    return MOBILE_RE.test(navigator.userAgent);
}
