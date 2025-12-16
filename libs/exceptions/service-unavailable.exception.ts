export class ServiceUnavailableException extends Error {
    constructor(public readonly serviceName: string) {
        super(`Service ${serviceName} is currently unavailable`);
    }
}
