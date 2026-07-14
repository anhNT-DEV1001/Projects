import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MasterData } from './entities';
import { DataSource, Repository } from 'typeorm';
import { MasterDataDto, MasterDataQueryDto } from './dto';
import { User } from '../users/entities';

@Injectable()
export class MasterdataService {
  constructor(
    @InjectRepository(MasterData)
    private readonly masterDataRepository: Repository<MasterData>,
    private readonly dataSource: DataSource,
  ) { }

  async getAllMasterData(query: MasterDataQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;
    let where: any = {}

    if (query.dataKey) {
      where.dataKey = query.dataKey;
    }

    const [data, total] = await this.masterDataRepository.findAndCount({
      where,
      skip: skip,
      take: limit,
      order: {
        dataOrder: 'ASC'
      }
    });
    return { data, total };
  }

  async getMasterDataName(dataKey: string, dataValue: string) {
    const data = await this.masterDataRepository.findOne({
      where: {
        dataKey: dataKey,
        dataValue: dataValue
      },
      select: {
        dataValueName: true
      }
    });
    return data?.dataValueName;
  }

  async getMasterDataNameAndValue(dataKey: string) {
    const data = await this.masterDataRepository.find({
      where: {
        dataKey: dataKey
      },
      select: {
        dataKey: true,
        dataValue: true,
        dataValueName: true
      },
      order: {
        dataOrder: 'ASC'
      }
    })
    return data;
  }

  async storeMasterData(dto: MasterDataDto, user: User) {
    try {
      let data;
      if (dto.id) {
        const master = await this.masterDataRepository.findOne({ where: { id: dto.id } });
        if (master) {
          data = this.masterDataRepository.merge(master, dto);
          data.updatedBy = user.id;
        } else throw new BadRequestException("Không tìm thấy dữ liệu!")
      }

      if (!data) {
        data = this.masterDataRepository.create(dto);
        data.createdBy = user.id;
      }
      await this.masterDataRepository.save(data);
      return data;

    } catch (error) {
      throw new BadRequestException("Có lỗi xảy ra khi lưu dữ liệu!");
    }
  }

  async deleteMasterData(id: number, user: User) {
    return await this.dataSource.transaction(async (transactionalEntityManager) => {
      const master = await transactionalEntityManager.findOne(MasterData, { where: { id } });
      if (!master) {
        throw new BadRequestException("Không tìm thấy dữ liệu!");
      }

      master.updatedBy = user.id;
      master.deletedBy = user.id;

      await transactionalEntityManager.save(master);
      await transactionalEntityManager.softRemove(master);

      return { message: "Xóa dữ liệu thành công" };
    }).catch((error) => {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException("Có lỗi xảy ra khi xóa dữ liệu!");
    });
  }
}

