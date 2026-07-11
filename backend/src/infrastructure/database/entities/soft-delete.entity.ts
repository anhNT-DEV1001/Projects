import { Column, DeleteDateColumn } from 'typeorm';

import { BaseEntity } from './base.entity';

export abstract class SoftDeleteEntity extends BaseEntity {
  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
    default: null,
  })
  deletedAt!: Date | null;

  @Column({
    name: 'deleted_by',
    type: 'integer',
    nullable: true,
    default: null,
  })
  deletedBy!: number | null;
}
