export class ForbiddenException extends Error {
    constructor(message: string = 'Access forbidden') {
        super(message);
    }
}
