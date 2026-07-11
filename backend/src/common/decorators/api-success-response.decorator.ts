import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { SuccessResponse } from '../responses';

interface ApiSuccessResponseOptions {
  description?: string;
  isArray?: boolean;
  nullable?: boolean;
  status?: 200 | 201;
}

export function ApiSuccessResponse(
  model?: Type<unknown>,
  options: ApiSuccessResponseOptions = {},
) {
  const {
    description,
    isArray = false,
    nullable = false,
    status = 200,
  } = options;
  const responseDecorator = status === 201 ? ApiCreatedResponse : ApiOkResponse;

  const dataSchema = model
    ? isArray
      ? {
          type: 'array',
          items: {
            $ref: getSchemaPath(model),
          },
          nullable,
        }
      : {
          $ref: getSchemaPath(model),
          nullable,
        }
    : {
        nullable: true,
        example: null,
      };

  return applyDecorators(
    ApiExtraModels(...(model ? [SuccessResponse, model] : [SuccessResponse])),
    responseDecorator({
      description,
      schema: {
        allOf: [
          {
            $ref: getSchemaPath(SuccessResponse),
          },
          {
            properties: {
              data: dataSchema,
            },
          },
        ],
      },
    }),
  );
}
