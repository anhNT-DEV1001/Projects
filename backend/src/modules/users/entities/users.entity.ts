import { SoftDeleteEntity } from 'src/infrastructure/database/entities';
import { Column, Entity, Index } from 'typeorm';

@Index('uq_users_username_active', ['username'], {
  unique: true,
  where: '"deleted_at" IS NULL',
})
@Index('uq_users_email_active', ['email'], {
  unique: true,
  where: '"deleted_at" IS NULL',
})
@Index('uq_users_phone_active', ['phone'], {
  unique: true,
  where: '"deleted_at" IS NULL AND "phone" IS NOT NULL',
})
@Entity('users')
export class User extends SoftDeleteEntity {
  @Column({ type: 'varchar', length: 100 })
  username!: string;

  @Column({ type: 'varchar', length: 100 })
  password!: string;

  @Column({ name: 'full_name', type: 'varchar', length: 255 })
  fullName!: string;

  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  avatar!: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    default: null,
  })
  phone!: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true, default: null })
  gender!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  address!: string | null;
}
