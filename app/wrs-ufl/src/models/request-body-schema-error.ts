export class SchemaError extends Error {
    /**
     * Initializes an object of SchemaError class
     */
    constructor(
        public statusCode: number,
        public message: string,
        public validationResult: { message: string }[]
    ) {
        super();
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, SchemaError.prototype);
    }
}