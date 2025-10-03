import { ValidationError } from 'class-validator';

/**
 * Extracts a simplified error message from class-validator errors.
 * @param errors - Array of ValidationError objects from validate().
 * @param allErrors - If true, joins all error messages with '; '. Defaults to false (returns first error only).
 * @returns A single error message string.
 */
export const getValidationErrorMessage = (
    errors: ValidationError[],
    allErrors: boolean = false
): string => {
    if (!errors || errors.length === 0) {
        return 'Validation failed';
    }

    const messages = errors
        .map((error) => {
            if (error.constraints) {
                // Get the first constraint message (e.g., 'password must be longer than or equal to 8 characters')
                return Object.values(error.constraints)[0] as string;
            }
            return `Invalid ${error.property}`;
        })
        .filter(Boolean); // Remove empty strings

    if (messages.length === 0) {
        return 'Validation failed';
    }

    return allErrors ? messages.join('; ') : messages[0];
};