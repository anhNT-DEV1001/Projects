import { SoftDeleteEntity } from "src/infrastructure/database/entities";
import { Column, Entity, OneToMany } from "typeorm";

@Entity("menus")
export class Menu extends SoftDeleteEntity {
  @Column({
    type: 'varchar',
    length: 100
  })
  title: string;
  @Column({
    type: 'varchar',
    length: 255
  })
  href: string;
  @Column({
    type: 'varchar',
    length: 255
  })
  icon: string;
  @Column({
    type: 'int'
  })
  order: number;
  @Column({
    type: 'varchar',
    length: 255
  })
  alias: string;
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true
  })
  parentId?: string;

  @OneToMany(() => Menu, (menu) => menu.parentId)
  children?: Menu[];
}