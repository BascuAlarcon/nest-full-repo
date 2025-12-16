export enum LogLevel {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    DEBUG = 'DEBUG'
}

export interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    context?: string;
    metadata?: Record<string, any>;
}

export class LoggingService {
    private logs: LogEntry[] = [];
    private maxLogsInMemory: number = 1000; // Límite para evitar consumo excesivo de memoria

    /**
     * Registra un mensaje de información
     */
    info(message: string, context?: string, metadata?: Record<string, any>): void {
        this.addLog(LogLevel.INFO, message, context, metadata);
    }

    /**
     * Registra un mensaje de advertencia
     */
    warn(message: string, context?: string, metadata?: Record<string, any>): void {
        this.addLog(LogLevel.WARN, message, context, metadata);
    }

    /**
     * Registra un mensaje de error
     */
    error(message: string, context?: string, metadata?: Record<string, any>): void {
        this.addLog(LogLevel.ERROR, message, context, metadata);
    }

    /**
     * Registra un mensaje de depuración
     */
    debug(message: string, context?: string, metadata?: Record<string, any>): void {
        this.addLog(LogLevel.DEBUG, message, context, metadata);
    }

    /**
     * Agrega un log al arreglo de logs
     */
    private addLog(level: LogLevel, message: string, context?: string, metadata?: Record<string, any>): void {
        const logEntry: LogEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            context,
            metadata
        };

        this.logs.push(logEntry);

        // Limitar el tamaño del arreglo para evitar consumo excesivo de memoria
        if (this.logs.length > this.maxLogsInMemory) {
            this.logs.shift(); // Eliminar el log más antiguo
        }

        // También imprimir en consola para desarrollo
        this.printToConsole(logEntry);
    }

    /**
     * Imprime el log en consola
     */
    private printToConsole(logEntry: LogEntry): void {
        const { timestamp, level, message, context, metadata } = logEntry;
        const contextStr = context ? `[${context}]` : '';
        const metadataStr = metadata ? JSON.stringify(metadata) : '';
        
        const logMessage = `${timestamp} ${level} ${contextStr} ${message} ${metadataStr}`;

        switch (level) {
            case LogLevel.ERROR:
                console.error(logMessage);
                break;
            case LogLevel.WARN:
                console.warn(logMessage);
                break;
            case LogLevel.DEBUG:
                console.debug(logMessage);
                break;
            default:
                console.log(logMessage);
        }
    }

    /**
     * Obtiene todos los logs almacenados
     */
    getLogs(): LogEntry[] {
        return [...this.logs]; // Retornar una copia para evitar mutaciones externas
    }

    /**
     * Obtiene logs filtrados por nivel
     */
    getLogsByLevel(level: LogLevel): LogEntry[] {
        return this.logs.filter(log => log.level === level);
    }

    /**
     * Obtiene logs filtrados por contexto
     */
    getLogsByContext(context: string): LogEntry[] {
        return this.logs.filter(log => log.context === context);
    }

    /**
     * Obtiene logs dentro de un rango de tiempo
     */
    getLogsByTimeRange(startTime: Date, endTime: Date): LogEntry[] {
        return this.logs.filter(log => {
            const logTime = new Date(log.timestamp);
            return logTime >= startTime && logTime <= endTime;
        });
    }

    /**
     * Limpia todos los logs almacenados
     */
    clearLogs(): void {
        this.logs = [];
    }

    /**
     * Obtiene el número de logs almacenados
     */
    getLogsCount(): number {
        return this.logs.length;
    }

    /**
     * Configura el límite máximo de logs en memoria
     */
    setMaxLogsInMemory(max: number): void {
        this.maxLogsInMemory = max;
    }
}
