export class InternalServerErrorException extends Error {
    constructor(message: string = 'Internal server error occurred') {
        super(message);
    }
}
