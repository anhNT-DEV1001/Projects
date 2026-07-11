import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import {
  ApiSuccessResponse,
  CurrentUser,
  Public,
  ResponseMessage,
} from 'src/common/decorators';

import {
  CreateUserDto,
  ListUsersQueryDto,
  UpdateUserDto,
  UserListResponseDto,
  UserParamDto,
  UserResponseDto,
} from './dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({
  description: 'Access token không hợp lệ hoặc đã hết hạn',
})
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Public()
  @Post()
  @ApiOperation({
    summary: 'Tạo người dùng',
  })
  @ApiSuccessResponse(UserResponseDto, {
    description: 'Tạo người dùng thành công',
    status: 201,
  })
  @ResponseMessage('Tạo người dùng thành công')
  create(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser('id') currentUserId: number,
  ) {
    return this.usersService.create(createUserDto, currentUserId);
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách người dùng',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'keyword',
    required: false,
    type: String,
    example: 'john',
  })
  @ApiQuery({
    name: 'gender',
    required: false,
    type: String,
    example: 'male',
  })
  @ApiSuccessResponse(UserListResponseDto, {
    description: 'Lấy danh sách người dùng thành công',
  })
  @ResponseMessage('Lấy danh sách người dùng thành công')
  findAll(@Query() query: ListUsersQueryDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy chi tiết người dùng',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
  })
  @ApiSuccessResponse(UserResponseDto, {
    description: 'Lấy thông tin người dùng thành công',
  })
  @ResponseMessage('Lấy thông tin người dùng thành công')
  findOne(@Param() params: UserParamDto) {
    return this.usersService.findOne(params.id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật người dùng',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
  })
  @ApiSuccessResponse(UserResponseDto, {
    description: 'Cập nhật người dùng thành công',
  })
  @ResponseMessage('Cập nhật người dùng thành công')
  update(
    @Param() params: UserParamDto,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser('id') currentUserId: number,
  ) {
    return this.usersService.update(params.id, updateUserDto, currentUserId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Xóa người dùng',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
  })
  @ApiSuccessResponse(undefined, {
    description: 'Xóa người dùng thành công',
    nullable: true,
  })
  @ResponseMessage('Xóa người dùng thành công')
  remove(
    @Param() params: UserParamDto,
    @CurrentUser('id') currentUserId: number,
  ) {
    return this.usersService.remove(params.id, currentUserId);
  }
}
