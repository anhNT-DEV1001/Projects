import { Module } from '@nestjs/common';
import { MasterdataController } from './masterdata.controller';
import { MasterdataService } from './masterdata.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterData } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([MasterData])
  ],
  controllers: [MasterdataController],
  providers: [MasterdataService],
  exports: [MasterdataService]
})
export class MasterdataModule { }
