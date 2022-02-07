export class SearchThrowError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, SearchThrowError.prototype);
    }
}
