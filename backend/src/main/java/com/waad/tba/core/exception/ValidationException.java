package com.waad.tba.core.exception;

/**
 * Exception thrown when validation fails for domain objects
 */
public class ValidationException extends RuntimeException {

    public ValidationException(String message) {
        super(message);
    }

    public ValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}