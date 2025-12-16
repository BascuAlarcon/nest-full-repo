export class TimeoutException extends Error {
    constructor(public readonly operation: string, public readonly timeoutMs: number) {
        super(`Operation '${operation}' timed out after ${timeoutMs}ms`);
    }
}
