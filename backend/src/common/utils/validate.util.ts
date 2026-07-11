import { ValidationError } from 'class-validator';

export interface ValidationErrorDetail {
  field: string;
  messages: string[];
}

export function flattenValidationErrors(
  errors: ValidationError[],
  parentPath = '',
): ValidationErrorDetail[] {
  const result: ValidationErrorDetail[] = [];

  for (const error of errors) {
    const currentPath = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;

    const messages = Object.values(error.constraints ?? {});

    if (messages.length > 0) {
      result.push({
        field: currentPath,
        messages,
      });
    }

    if (error.children && error.children.length > 0) {
      result.push(...flattenValidationErrors(error.children, currentPath));
    }
  }

  return result;
}
