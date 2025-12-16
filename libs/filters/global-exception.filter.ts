import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggingService } from '../logging';
import {
    ItemNotFoundException,
    ValidationException,
    UnauthorizedException,
    ForbiddenException,
    ConflictException,
    InternalServerErrorException,
    ServiceUnavailableException,
    TimeoutException,
} from '../exceptions';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    constructor(private readonly loggingService: LoggingService) {}

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        // Determinar el status code y el mensaje
        let status: HttpStatus;
        let message: string;
        let errors: any = null;

        // Mapear excepciones personalizadas a códigos HTTP
        if (exception instanceof ItemNotFoundException) {
            status = HttpStatus.NOT_FOUND;
            message = exception.message;
        } else if (exception instanceof ValidationException) {
            status = HttpStatus.BAD_REQUEST;
            message = 'Validation failed';
            errors = exception.errors;
        } else if (exception instanceof UnauthorizedException) {
            status = HttpStatus.UNAUTHORIZED;
            message = exception.message;
        } else if (exception instanceof ForbiddenException) {
            status = HttpStatus.FORBIDDEN;
            message = exception.message;
        } else if (exception instanceof ConflictException) {
            status = HttpStatus.CONFLICT;
            message = exception.message;
        } else if (exception instanceof ServiceUnavailableException) {
            status = HttpStatus.SERVICE_UNAVAILABLE;
            message = exception.message;
        } else if (exception instanceof TimeoutException) {
            status = HttpStatus.REQUEST_TIMEOUT;
            message = exception.message;
        } else if (exception instanceof InternalServerErrorException) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = exception.message;
        } else if (exception instanceof HttpException) {
            // Excepciones HTTP de NestJS
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            message =
                typeof exceptionResponse === 'string'
                    ? exceptionResponse
                    : (exceptionResponse as any).message || 'Error occurred';
        } else {
            // Errores no controlados
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'Internal server error';
        }

        // Logging del error
        this.loggingService.error(
            message,
            'GlobalExceptionFilter',
            {
                statusCode: status,
                path: request.url,
                method: request.method,
                exception: exception instanceof Error ? exception.name : 'Unknown',
                stack: exception instanceof Error ? exception.stack : undefined,
                errors,
            }
        );

        // Respuesta HTTP
        const errorResponse: any = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message,
        };

        if (errors) {
            errorResponse.errors = errors;
        }

        response.status(status).json(errorResponse);
    }
}
