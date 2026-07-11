import { Controller, Get } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

import { Public, ResponseMessage } from './common/decorators';
import { SuccessResponse } from './common/responses';
import { AppService } from './app.service';

@ApiTags('App')
@ApiExtraModels(SuccessResponse)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Kiểm tra trạng thái dịch vụ',
  })
  @ApiOkResponse({
    description: 'Trả về thông điệp kiểm tra service',
    schema: {
      allOf: [
        {
          $ref: getSchemaPath(SuccessResponse),
        },
        {
          properties: {
            data: {
              type: 'string',
              example: 'Hello World!',
            },
          },
        },
      ],
    },
  })
  @ResponseMessage('Kiểm tra service thành công')
  getHello(): string {
    return this.appService.getHello();
  }
}
