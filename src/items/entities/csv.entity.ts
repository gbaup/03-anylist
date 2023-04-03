import { ObjectType } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Item } from './item.entity';

@Entity({ name: 'csv' })
@ObjectType()
export class CsvData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  date: string;

  @Column()
  nrofactura: number;

  @Column()
  nroproducto: number;

  @OneToOne(() => Item, (item) => item.csv, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  items: Item;
}
