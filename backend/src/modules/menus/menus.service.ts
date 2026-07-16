import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './entities';
import { DataSource, Repository } from 'typeorm';
import { MenuDto } from './dto/menus.dto';
import { User } from '../users/entities';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    private readonly dataSource: DataSource
  ) { }

  async storeMenu(menuDto: MenuDto, user: User) {
    let data;
    if (menuDto.id) {
      data = await this.menuRepository.findOne({ where: { id: menuDto.id } });
      // if (!data) throw new BadRequestException("Không tồn tại Menu");
      await this.menuRepository.merge(data, menuDto);
      data.updatedBy = user.id;
    } else {
      data = this.menuRepository.create(menuDto);
      data.createdBy = user.id;
    }

    return await this.menuRepository.save(data);
  }

  async getListMenus() {
    const allMenus = await this.menuRepository.find({
      order: {
        order: 'ASC',
      },
    });

    // Initialize children property for all menus
    for (const menu of allMenus) {
      menu.children = [];
    }

    // Map each menu by its ID for fast lookup
    const menuMap = new Map<number, Menu>();
    for (const menu of allMenus) {
      menuMap.set(menu.id, menu);
    }

    const tree: Menu[] = [];

    for (const menu of allMenus) {
      const parentId = menu.parentId;

      if (parentId) {
        const numericParentId = Number(parentId);
        const parent = menuMap.get(numericParentId);

        if (parent) {
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(menu);
        } else {
          tree.push(menu);
        }
      } else {
        tree.push(menu);
      }
    }

    return tree;
  }

  async deleteMenu(id: number, user: User) {
    return await this.dataSource.transaction(async (manager) => {
      const menu = await manager.findOne(Menu, { where: { id } });
      if (!menu) throw new BadRequestException("Không tồn tại Menu");
      menu.deletedBy = user.id;
      menu.updatedBy = user.id;
      await manager.save(menu);
      await manager.softRemove(menu);
      return true;
    }).catch((error) => {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException("Có lỗi xảy ra khi xóa menu!");
    })
  }
}
