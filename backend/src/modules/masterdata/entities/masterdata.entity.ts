import { SoftDeleteEntity } from "src/infrastructure/database/entities";
import { Column, Entity } from "typeorm";

@Entity('master_data')
export class MasterData extends SoftDeleteEntity {
  @Column({
    type: 'varchar',
    name: "data_key",
    length: 200,
    nullable: false,
  })
  dataKey: string

  @Column({
    type: 'varchar',
    name: "data_value",
    length: 500,
    nullable: false,
  })
  dataValue: string

  @Column({
    type: 'varchar',
    name: "data_value_name",
    length: 200,
    nullable: false,
  })
  dataValueName: string

  @Column({
    type: 'varchar',
    name: "data_key_name",
    length: 200,
    nullable: false,
  })
  dataKeyName: string

  @Column({
    type: 'int',
    name: "data_order",
    nullable: false,
    default: 0
  })
  dataOrder: number

  @Column({
    type: 'varchar',
    name: "data_description",
    length: 500,
    nullable: true,
  })
  dataDescription?: string
}