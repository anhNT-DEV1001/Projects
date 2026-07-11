import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'integer',
  })
  id!: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;

  @Column({
    name: 'created_by',
    type: 'integer',
    nullable: true,
    default: null,
  })
  createdBy!: number | null;

  @Column({
    name: 'updated_by',
    type: 'integer',
    nullable: true,
    default: null,
  })
  updatedBy!: number | null;
}
