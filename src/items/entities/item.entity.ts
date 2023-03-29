import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CsvData } from './csv.entity';

@Entity({ name: 'reclamos' })
@ObjectType()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;
  @Column()
  @Field(() => Int)
  nroreclamo: number;
  @Column()
  @Field(() => String)
  title: string;
  @Column()
  @Field(() => String)
  description: string;
  @Column({ nullable: true })
  @Field(() => String)
  detalleCompraCSV: string;

  @OneToOne(() => CsvData, (csvData) => csvData.id, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  csv: CsvData;
}
