import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { MasterdataService } from './masterdata.service';
import { ApiSuccessResponse, CurrentUser } from 'src/common/decorators';
import { SuccessResponse } from 'src/common/responses';
import { User } from '../users/entities';
import {
  MasterDataDto,
  MasterDataQueryDto,
  MasterDataResponseDto,
  MasterDataNameAndValueResponseDto,
  MasterDataListResponseDto,
} from './dto';

@ApiTags('MasterData')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({
  description: 'Access token không hợp lệ hoặc đã hết hạn',
})
@ApiExtraModels(SuccessResponse)
@Controller('masterdata')
export class MasterdataController {
  constructor(
    private readonly masterdataService: MasterdataService,
  ) { }

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách Master Data phân trang',
  })
  @ApiSuccessResponse(MasterDataListResponseDto, {
    description: 'Lấy danh sách Master Data thành công',
  })
  async getAllMasterData(@Query() query: MasterDataQueryDto) {
    return this.masterdataService.getAllMasterData(query);
  }

  @Get('name-value/:dataKey')
  @ApiOperation({
    summary: 'Lấy danh sách key-value và tên hiển thị theo dataKey',
  })
  @ApiParam({
    name: 'dataKey',
    type: String,
    example: 'GENDER',
    description: 'Khóa phân loại dữ liệu',
  })
  @ApiSuccessResponse(MasterDataNameAndValueResponseDto, {
    description: 'Lấy danh sách key-value thành công',
    isArray: true,
  })
  async getMasterDataNameAndValue(@Param('dataKey') dataKey: string) {
    return this.masterdataService.getMasterDataNameAndValue(dataKey);
  }

  @Get('name/:dataKey/:dataValue')
  @ApiOperation({
    summary: 'Lấy tên hiển thị của một giá trị cụ thể',
  })
  @ApiParam({
    name: 'dataKey',
    type: String,
    example: 'GENDER',
    description: 'Khóa phân loại dữ liệu',
  })
  @ApiParam({
    name: 'dataValue',
    type: String,
    example: 'MALE',
    description: 'Giá trị dữ liệu',
  })
  @ApiOkResponse({
    description: 'Lấy tên hiển thị thành công',
    schema: {
      allOf: [
        {
          $ref: getSchemaPath(SuccessResponse),
        },
        {
          properties: {
            data: {
              type: 'string',
              example: 'Nam',
            },
          },
        },
      ],
    },
  })
  async getMasterDataName(@Param('dataKey') dataKey: string, @Param('dataValue') dataValue: string) {
    return this.masterdataService.getMasterDataName(dataKey, dataValue);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lưu hoặc cập nhật Master Data',
    description: 'Tạo mới nếu id không được truyền, cập nhật nếu id đã tồn tại.',
  })
  @ApiSuccessResponse(MasterDataResponseDto, {
    description: 'Lưu hoặc cập nhật Master Data thành công',
  })
  async storeMasterData(@Body() body: MasterDataDto, @CurrentUser() user: User) {
    return this.masterdataService.storeMasterData(body, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Xóa Master Data (xóa mềm)',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'ID của Master Data cần xóa',
  })
  @ApiSuccessResponse(undefined, {
    description: 'Xóa Master Data thành công',
    nullable: true,
  })
  async deleteMasterData(@Param('id') id: number, @CurrentUser() user: User) {
    return this.masterdataService.deleteMasterData(id, user);
  }
}