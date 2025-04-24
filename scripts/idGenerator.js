
export function idGenerator() {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
    return id;
}
