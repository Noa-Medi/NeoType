export function hashDecoder(hash) {
    if (hash.length > 0) {
        return decodeURIComponent(hash.substring(1))
    } else {
        return null;
    }
}