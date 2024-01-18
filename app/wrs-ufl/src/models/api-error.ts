export class ApiError extends Error {
    /**
     * Initializes an object of ObaError class
     */
    constructor(public statusCode: number, public message: string) {
        super();
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}