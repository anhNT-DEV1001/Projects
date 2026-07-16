import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { MenusService } from './menus.service';
import { ApiSuccessResponse, CurrentUser } from 'src/common/decorators';
import { User } from '../users/entities';
import { MenuDto, MenuResponseDto } from './dto/menus.dto';

@ApiTags('Menus')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({
  description: 'Access token không hợp lệ hoặc đã hết hạn',
})
@Controller('menus')
export class MenusController {
  constructor(
    private readonly menusService: MenusService
  ) { }

  @Post('store')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lưu hoặc cập nhật Menu',
    description: 'Nếu có id trong body thì cập nhật, nếu không thì tạo mới.',
  })
  @ApiSuccessResponse(MenuResponseDto, {
    description: 'Lưu hoặc cập nhật menu thành công',
  })
  async storeMenu(@Body() menuDto: MenuDto, @CurrentUser() user: User) {
    return this.menusService.storeMenu(menuDto, user);
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách Menu dạng cây (Tree)',
  })
  @ApiSuccessResponse(MenuResponseDto, {
    description: 'Lấy danh sách menu thành công',
    isArray: true,
  })
  async getListMenus() {
    return this.menusService.getListMenus();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Xóa Menu (xóa mềm)',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'ID của menu cần xóa',
  })
  @ApiSuccessResponse(undefined, {
    description: 'Xóa menu thành công',
    nullable: true,
  })
  async deleteMenu(@Param('id') id: number, @CurrentUser() user: User) {
    return this.menusService.deleteMenu(id, user);
  }
}

