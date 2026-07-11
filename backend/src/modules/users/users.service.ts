import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Brackets, FindOptionsWhere, Repository } from 'typeorm';

import {
  CreateUserDto,
  ListUsersQueryDto,
  UpdateUserDto,
  UserListResponseDto,
  UserResponseDto,
} from './dto';
import { User } from './entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    currentUserId: number | null,
  ): Promise<UserResponseDto> {
    const conditions: FindOptionsWhere<User>[] = [
      {
        username: createUserDto.username,
      },
      {
        email: createUserDto.email,
      },
    ];

    if (createUserDto.phone) {
      conditions.push({
        phone: createUserDto.phone,
      });
    }

    const existUser = await this.usersRepository.findOne({
      where: conditions,
    });

    if (existUser)
      throw new BadRequestException('Thông tin người dùng đã tồn tại');

    const user = this.usersRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
      createdBy: currentUserId,
      updatedBy: currentUserId,
    });

    const createdUser = await this.usersRepository.save(user);

    return this.toUserResponse(createdUser);
  }

  async findAll(query: ListUsersQueryDto): Promise<UserListResponseDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const keyword = query.keyword?.trim();

    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    if (keyword) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('user.username ILIKE :keyword', {
            keyword: `%${keyword}%`,
          })
            .orWhere('user.fullName ILIKE :keyword', {
              keyword: `%${keyword}%`,
            })
            .orWhere('user.email ILIKE :keyword', {
              keyword: `%${keyword}%`,
            })
            .orWhere('user.phone ILIKE :keyword', {
              keyword: `%${keyword}%`,
            });
        }),
      );
    }

    queryBuilder
      .orderBy('user.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [users, totalItems] = await queryBuilder.getManyAndCount();

    return {
      items: users.map((user) => this.toUserResponse(user)),
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / limit),
      },
    };
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.findUserById(id);
    return this.toUserResponse(user);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    currentUserId: number | null,
  ): Promise<UserResponseDto> {
    const user = await this.findUserById(id);
    const conditions: FindOptionsWhere<User>[] = [];

    if (updateUserDto.email) {
      conditions.push({
        email: updateUserDto.email,
      });
    }

    if (updateUserDto.phone) {
      conditions.push({
        phone: updateUserDto.phone,
      });
    }

    if (conditions.length > 0) {
      const existUser = await this.usersRepository.findOne({
        where: conditions,
      });

      if (existUser && existUser.id !== id) {
        throw new BadRequestException('Thông tin người dùng đã tồn tại');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto, {
      updatedBy: currentUserId,
    });

    const updatedUser = await this.usersRepository.save(user);
    return this.toUserResponse(updatedUser);
  }

  async remove(id: number, currentUserId: number | null): Promise<null> {
    const user = await this.findUserById(id);
    user.deletedBy = currentUserId;
    await this.usersRepository.softRemove(user);
    return null;
  }

  async findUserByIdWithPassword(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'Không tìm thấy người dùng',
      });
    }

    return user;
  }

  async findUserByUsernameForAuth(username: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { username },
    });
  }

  async findUserByIdForAuth(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  public toUserResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
      phone: user.phone,
      gender: user.gender,
      address: user.address,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      createdBy: user.createdBy,
      updatedBy: user.updatedBy,
      deletedAt: user.deletedAt,
      deletedBy: user.deletedBy,
    };
  }

  private async findUserById(id: number): Promise<User> {
    return this.findUserByIdWithPassword(id);
  }
}
