export class ValidationException extends Error {
    constructor(public readonly errors: Record<string, string[]>) {
        super(`Validation failed: ${JSON.stringify(errors)}`);
    }
}
