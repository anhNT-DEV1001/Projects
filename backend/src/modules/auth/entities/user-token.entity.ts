import { BaseEntity } from 'src/infrastructure/database/entities';
import { Column, Entity, Index } from 'typeorm';
@Entity('user_tokens')
@Index('IDX_user_tokens_session_id', ['sessionId'], {
  unique: true,
})
@Index('IDX_user_tokens_user_id', ['userId'])
export class UserToken extends BaseEntity {
  @Column({ name: 'user_id', type: 'bigint' })
  userId!: number;
  @Column({ type: 'varchar', length: 20 })
  ip!: string;
  @Column({ type: 'varchar', length: 255 })
  agent!: string;
  @Column({ type: 'uuid', name: 'session_id' })
  sessionId!: string;
  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  token!: string | null;
  @Column({
    type: 'timestamptz',
    nullable: true,
    default: null,
    name: 'expires_at',
  })
  expiresAt!: Date | null;
}
