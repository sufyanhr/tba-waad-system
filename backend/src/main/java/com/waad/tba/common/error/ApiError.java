package com.waad.tba.common.error;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Schema(description = "Unified error response schema for all API error results")
@Getter
@ToString
@Builder
public class ApiError {
    @Schema(description = "Always 'error'", example = "error")
    private final String status;

    @Schema(description = "Standard error code identifying the failure type", example = "USER_NOT_FOUND")
    private final String code;

    @Schema(description = "Human readable error message", example = "The requested user does not exist")
    private final String message;

    @Schema(description = "Timestamp in ISO-8601 UTC format", example = "2025-01-01T10:00:00Z")
    private final String timestamp;

    @Schema(description = "Request path that generated the error", example = "/api/admin/users/55")
    private final String path;

    @Schema(description = "Optional additional details (validation errors, context, etc.)")
    private final Object details;

    public static ApiError of(ErrorCode code, String message, String path, Object details, String timestamp) {
        return ApiError.builder()
                .status("error")
                .code(code.name())
                .message(message)
                .timestamp(timestamp)
                .path(path)
                .details(details)
                .build();
    }
}
