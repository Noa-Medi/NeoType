
export function idGenerator() {
    const id = Math.random().toString(34).slice(2, 9);
    return id;
}
