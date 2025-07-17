import { Alert } from 'react-native';
import { MESSAGES } from '@/constants/app';

export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  STORAGE = 'STORAGE',
  AUDIO = 'AUDIO',
  GENERAL = 'GENERAL',
  TIMEOUT = 'TIMEOUT',
  PERMISSION = 'PERMISSION',
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface ErrorInfo {
  message: string;
  action?: string;
  details?: string;
  type?: ErrorType;
  severity?: ErrorSeverity;
  showAlert?: boolean;
  timestamp?: Date;
}

export interface ErrorContext {
  component?: string;
  operation?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly severity: ErrorSeverity;
  public readonly context: ErrorContext;
  public readonly timestamp: Date;
  public readonly userMessage: string;

  constructor(
    message: string,
    userMessage: string,
    type: ErrorType = ErrorType.GENERAL,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    context: ErrorContext = {}
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.severity = severity;
    this.context = context;
    this.timestamp = new Date();
    this.userMessage = userMessage;
  }
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorQueue: AppError[] = [];
  private maxQueueSize = 100;

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  handleError(error: unknown, context: ErrorContext = {}): void {
    const appError = this.normalizeError(error, context);
    this.logError(appError);
    this.queueError(appError);
    
    if (appError.severity === ErrorSeverity.HIGH || appError.severity === ErrorSeverity.CRITICAL) {
      this.showErrorAlert(appError);
    }
  }

  handleAsyncError<T>(
    operation: () => Promise<T>,
    context: ErrorContext = {},
    fallbackValue?: T
  ): Promise<T | null> {
    return operation().catch(error => {
      this.handleError(error, context);
      return fallbackValue ?? null;
    });
  }

  private normalizeError(error: unknown, context: ErrorContext): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      return new AppError(
        error.message,
        this.getUserMessage(error),
        this.inferErrorType(error),
        this.inferErrorSeverity(error),
        context
      );
    }

    const errorMessage = String(error);
    return new AppError(
      errorMessage,
      MESSAGES.ERROR.GENERAL,
      ErrorType.GENERAL,
      ErrorSeverity.MEDIUM,
      context
    );
  }

  private getUserMessage(error: Error): string {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'Please check your internet connection and try again.';
    }
    
    if (message.includes('timeout')) {
      return 'The request took too long. Please try again.';
    }
    
    if (message.includes('permission')) {
      return 'Permission denied. Please check your app permissions.';
    }
    
    if (message.includes('storage') || message.includes('disk')) {
      return 'Storage error. Please check available space and try again.';
    }
    
    if (message.includes('audio')) {
      return MESSAGES.ERROR.AUDIO_PLAY_FAILED;
    }
    
    return MESSAGES.ERROR.GENERAL;
  }

  private inferErrorType(error: Error): ErrorType {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) return ErrorType.NETWORK;
    if (message.includes('validation')) return ErrorType.VALIDATION;
    if (message.includes('storage')) return ErrorType.STORAGE;
    if (message.includes('audio')) return ErrorType.AUDIO;
    if (message.includes('timeout')) return ErrorType.TIMEOUT;
    if (message.includes('permission')) return ErrorType.PERMISSION;
    
    return ErrorType.GENERAL;
  }

  private inferErrorSeverity(error: Error): ErrorSeverity {
    const message = error.message.toLowerCase();
    
    if (message.includes('critical') || message.includes('fatal')) return ErrorSeverity.CRITICAL;
    if (message.includes('network') || message.includes('storage')) return ErrorSeverity.HIGH;
    if (message.includes('validation')) return ErrorSeverity.LOW;
    
    return ErrorSeverity.MEDIUM;
  }

  private logError(error: AppError): void {
    const logLevel = this.getLogLevel(error.severity);
    const logMessage = `[${error.type}] ${error.message}`;
    
    console.group(`🔴 Error - ${error.severity}`);
    console.error(logMessage);
    console.error('Context:', error.context);
    console.error('Stack:', error.stack);
    console.error('Timestamp:', error.timestamp.toISOString());
    console.groupEnd();
  }

  private getLogLevel(severity: ErrorSeverity): 'error' | 'warn' | 'info' {
    switch (severity) {
      case ErrorSeverity.CRITICAL:
      case ErrorSeverity.HIGH:
        return 'error';
      case ErrorSeverity.MEDIUM:
        return 'warn';
      case ErrorSeverity.LOW:
        return 'info';
      default:
        return 'error';
    }
  }

  private queueError(error: AppError): void {
    this.errorQueue.push(error);
    
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }
  }

  private showErrorAlert(error: AppError): void {
    const title = this.getAlertTitle(error.severity);
    
    Alert.alert(
      title,
      error.userMessage,
      [
        { text: 'OK', style: 'default' },
        ...(error.severity === ErrorSeverity.CRITICAL ? [
          { text: 'Report', onPress: () => this.reportError(error) }
        ] : [])
      ]
    );
  }

  private getAlertTitle(severity: ErrorSeverity): string {
    switch (severity) {
      case ErrorSeverity.CRITICAL:
        return 'Critical Error';
      case ErrorSeverity.HIGH:
        return 'Error';
      case ErrorSeverity.MEDIUM:
        return 'Warning';
      case ErrorSeverity.LOW:
        return 'Notice';
      default:
        return 'Error';
    }
  }

  private reportError(error: AppError): void {
    // This would integrate with crash reporting services like Crashlytics, Sentry, etc.
    console.log('Error reported:', error);
  }

  getErrorHistory(): AppError[] {
    return [...this.errorQueue];
  }

  clearErrorHistory(): void {
    this.errorQueue = [];
  }
}

// Legacy API compatibility
export function handleError(error: unknown, info: ErrorInfo): void {
  const errorHandler = ErrorHandler.getInstance();
  errorHandler.handleError(error, {
    component: info.action,
    operation: info.action,
    metadata: { details: info.details }
  });
}

export function handleAsyncError<T>(
  operation: () => Promise<T>,
  errorInfo: ErrorInfo
): Promise<T | null> {
  const errorHandler = ErrorHandler.getInstance();
  return errorHandler.handleAsyncError(operation, {
    component: errorInfo.action,
    operation: errorInfo.action,
    metadata: { details: errorInfo.details }
  });
}

export function logError(error: unknown, context: string): void {
  const errorHandler = ErrorHandler.getInstance();
  errorHandler.handleError(error, {
    component: context,
    operation: context
  });
}

// New simplified API
export const errorHandler = ErrorHandler.getInstance();