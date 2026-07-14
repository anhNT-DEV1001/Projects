import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { MasterdataService } from './masterdata.service';
import { CurrentUser } from 'src/common/decorators';
import { User } from '../users/entities';
import { MasterDataDto, MasterDataQueryDto } from './dto';

@Controller('masterdata')
export class MasterdataController {
  constructor(
    private readonly masterdataService: MasterdataService,
  ) { }

  @Get()
  async getAllMasterData(@Query() query: MasterDataQueryDto) {
    return this.masterdataService.getAllMasterData(query);
  }

  @Get('name-value/:dataKey')
  async getMasterDataNameAndValue(@Param('dataKey') dataKey: string) {
    return this.masterdataService.getMasterDataNameAndValue(dataKey);
  }

  @Get('name/:dataKey/:dataValue')
  async getMasterDataName(@Param('dataKey') dataKey: string, @Param('dataValue') dataValue: string) {
    return this.masterdataService.getMasterDataName(dataKey, dataValue);
  }

  @Post()
  async storeMasterData(@Body() body: MasterDataDto, @CurrentUser() user: User) {
    return this.masterdataService.storeMasterData(body, user);
  }

  @Delete(':id')
  async deleteMasterData(@Param('id') id: number, @CurrentUser() user: User) {
    return this.masterdataService.deleteMasterData(id, user);
  }
}